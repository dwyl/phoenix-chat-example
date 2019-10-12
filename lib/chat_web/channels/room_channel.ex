defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel
  alias Phoenix.Socket
  alias Chat.Presence

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (chat_room:lobby).
  def handle_in("shout", payload, socket) do
    {:ok, msg} =
      Chat.Message.changeset(%Chat.Message{}, payload)
      |> Chat.Repo.insert()

    socket
    |> Socket.assign(:user_name, msg.name)
    |> track_presence()
    |> broadcast("shout", Map.put_new(payload, :id, msg.id))

    {:noreply, socket}
  end

  # example see: https://git.io/vNsYD
  def handle_info(:after_join, socket) do
    # Send currently online users in lobby
    push(socket, "presence_state", Presence.list("room:lobby"))

    # get messages 10 - 1000
    Chat.Message.get_messages()
    |> Enum.each(fn msg ->
      push(socket, "shout", %{
        name: msg.name,
        message: msg.message,
        id: msg.id
      })
    end)

    # :noreply
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  # Add a track in Presence when user joins the channel
  # Ideally this should be on joining "room:lobby" but the socket has no info as of now
  # to associate with a user.

  defp track_presence(socket) do
    case do_track(socket) do
      {:ok, _ref} -> socket
      {:error, {:already_tracked, _pid, _channel, _user}} -> socket
    end
  end

  defp do_track(%{assigns: %{user_name: user_name}} = socket) when not is_nil(user_name) do
    Presence.track(socket, user_name, %{
      online_at: inspect(System.system_time(:second))
    })
  end
end

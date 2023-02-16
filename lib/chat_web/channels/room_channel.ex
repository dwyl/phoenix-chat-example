defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel
  alias ChatWeb.Presence

  @impl true
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
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    # Insert message in database
    {:ok, msg} = Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert()

    # Assigning name to socket assigns and tracking presence
    socket
      |> assign(:username, msg.name)
      |> track_presence()
      |> broadcast("shout", Map.put_new(payload, :id, msg.id))

    {:noreply, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    # Get messages and list them
    Chat.Message.get_messages()
    |> Enum.reverse()     # reverts the enum to display the latest message at the bottom of the page
    |> Enum.each(fn msg ->
      push(socket, "shout", %{
        name: msg.name,
        message: msg.message,
        inserted_at: msg.inserted_at
      })
    end)

    # Send currently online people in lobby
    push(socket, "presence_state", Presence.list("room:lobby"))

    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  # This creates a Presence track when the person joins the channel.
  # Normally this is done when joining the channel,
  # but the socket doesn't know the name so we wait for a message to be sent
  # with the name to begin tracking.
  defp track_presence(%{assigns: %{username: username}} = socket) do
    Presence.track(socket, username, %{
      online_at: inspect(System.system_time(:second))
    })

    socket
  end

end

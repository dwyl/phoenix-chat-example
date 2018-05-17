defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel

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

    broadcast(socket, "shout", Map.put_new(payload, :id, msg.id))
    {:noreply, socket}
  end

  # example see: https://git.io/vNsYD
  def handle_info(:after_join, socket) do
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
end

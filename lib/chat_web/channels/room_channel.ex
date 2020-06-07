defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("shout", payload, socket) do
    Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert()
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  # if you know how to invoke this function in a test please share!!
  @impl true
  # coveralls-ignore-start
  def handle_info(:after_join, socket) do
    Chat.Message.get_messages()
    |> Enum.each(fn msg ->
      push(socket, "shout", %{
        name: msg.name,
        message: msg.message
      })
    end)

    # :noreply
    {:noreply, socket}
  end
  # coveralls-ignore-stop
end

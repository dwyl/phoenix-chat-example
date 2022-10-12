defmodule ChatWeb.RoomChannelTest do
  use ChatWeb.ChannelCase

  setup do
    {:ok, _, socket} =
      ChatWeb.UserSocket
      |> socket("user_id", %{some: :assign})
      |> subscribe_and_join(ChatWeb.RoomChannel, "room:lobby")

    %{socket: socket}
  end

  test "ping replies with status ok", %{socket: socket} do
    ref = push(socket, "ping", %{"hello" => "there"})
    assert_reply ref, :ok, %{"hello" => "there"}
  end

  test "shout broadcasts to room:lobby", %{socket: socket} do
    push(socket, "shout", %{"hello" => "all"})
    assert_broadcast "shout", %{"hello" => "all"}
  end

  test "broadcasts are pushed to the client", %{socket: socket} do
    broadcast_from!(socket, "broadcast", %{"some" => "data"})
    assert_push "broadcast", %{"some" => "data"}
  end

  test ":after_join sends all existing messages", %{socket: socket} do
    # insert a new message to send in the :after_join
    payload = %{name: "Alex", message: "test"}
    Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert()

    {:ok, _, socket2} = ChatWeb.UserSocket
      |> socket("user_id", %{some: :assign})
      |> subscribe_and_join(ChatWeb.RoomChannel, "room:lobby")

    assert socket2.join_ref != socket.join_ref
  end
end

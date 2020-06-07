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
    ref = push socket, "ping", %{"hello" => "there"}
    assert_reply ref, :ok, %{"hello" => "there"}
  end

  test "shout broadcasts to room:lobby", %{socket: socket} do
    push socket, "shout", %{"hello" => "all"}
    assert_broadcast "shout", %{"hello" => "all"}
  end

  test "broadcasts are pushed to the client", %{socket: socket} do
    broadcast_from! socket, "broadcast", %{"some" => "data"}
    assert_push "broadcast", %{"some" => "data"}
  end

  test ":after_join sends all existing messages", %{socket: socket} do
    {:ok, _, socket} = subscribe_and_join(socket, "room:lobby", socket)
    {:noreply, socket2} = ChatWeb.RoomChannel.handle_info(:after_join, socket)
    # IO.inspect(socket2)
    assert socket2.join_ref > 0
  end
end

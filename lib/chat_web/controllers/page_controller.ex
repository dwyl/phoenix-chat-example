defmodule ChatWeb.PageController do
  use ChatWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html", messages: Chat.Message.get_messages(20))
  end
end

defmodule ChatWeb.PageController do
  use ChatWeb, :controller

  def index(conn, _params) do
    messages = Chat.Message.get_messages
    render(conn, "index.html", messages: messages)
  end
end

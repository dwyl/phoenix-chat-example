defmodule ChatWeb.PageController do
  use ChatWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

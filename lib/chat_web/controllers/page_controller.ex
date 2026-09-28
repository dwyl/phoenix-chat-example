defmodule ChatWeb.PageController do
  use ChatWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end

defmodule ChatWeb.PageControllerTest do
  use ChatWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, ~p"/")
    assert html_response(conn, 200) =~ "Phoenix Chat Example"
  end
end

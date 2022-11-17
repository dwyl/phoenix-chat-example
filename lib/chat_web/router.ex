defmodule ChatWeb.Router do
  use ChatWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {ChatWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authOptional, do: plug(AuthPlugOptional)

  scope "/", ChatWeb do
    pipe_through [:browser, :authOptional]

    get "/", PageController, :index
    get "/login", AuthController, :login
    get "/logout", AuthController, :logout
  end

end

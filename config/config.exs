# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :chat,
  ecto_repos: [Chat.Repo]

# Configures the endpoint
config :chat, ChatWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "6OFS0/PTjxt7qG4rj5zC2WmrpEZOTQSA0n0w3jILDKXiJB4LoqiMGzsuSytDBmvV",
  render_errors: [view: ChatWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Chat.PubSub,
  live_view: [signing_salt: "zlw3ir6l"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, false


# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :esbuild,
  version: "0.13.4",
  default: [
    args: ~w(js/app.js --bundle --target=es2016 --outdir=../priv/static/assets),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

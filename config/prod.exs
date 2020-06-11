use Mix.Config

config :chat, ChatWeb.Endpoint,
  load_from_system_env: true,
  http: [port: {:system, "PORT"}], #
  url: [scheme: "https", host: "phxchat.herokuapp.com", port: 443],
  # port: System.get_env("PORT")], # Heroku Supplies the TCP Port
  force_ssl: [rewrite_on: [:x_forwarded_proto]],
  cache_static_manifest: "priv/static/cache_manifest.json",
  secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE")

# Do not print debug messages in production
config :logger, level: :info

# Configure your database
config :chat, Chat.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: System.get_env("DATABASE_URL"),
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
  ssl: true

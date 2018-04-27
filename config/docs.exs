use Mix.Config

# Configure your database
config :chat, Chat.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "chat_dev",
  hostname: "localhost",
  pool_size: 10

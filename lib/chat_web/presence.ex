defmodule ChatWeb.Presence do
  use Phoenix.Presence,
    otp_app: :chat,
    pubsub_server: Chat.PubSub
end

<div align="center">

# Adding `Presence` in 10 Minutes! 🔐

</div>

Most chat apps have a feature 
where you can check who is currently online.
We can use [`Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
to track processes 
that are connected to our public channel room.

By using Presence,
we can show *which processes*
are actively connected to the channel
and show it to the user!

It isn't as difficult as you may think.
Let's do it! 🏃‍♂️


- [Adding `Presence` in 10 Minutes! 🔐](#adding-presence-in-10-minutes-)
  - [1. Setting up `Presence`](#1-setting-up-presence)


## 1. Setting up `Presence`

[`Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
is a Phoenix module 
that needs to be set up before being used.

Firstly, in `lib/chat_web`, 
create a file called `presence.ex` 
and add the following code.

```elixir
defmodule ChatWeb.Presence do
  use Phoenix.Presence,
    otp_app: :chat,
    pubsub_server: Chat.PubSub
end
```

We are populating the `:otp_app` and `:pubsub_server`
with already pre-existent configurations.
For example, `:chat` is configured
inside the `config/config.exs` file
and being fed to `:otp_app`.

Next, we need to add this new supervisor
to the supervision tree
in `lib/chat/application.ex`.
Make sure to add `ChatWeb.Presence`
**before `ChatWeb.Endpoint`**
and **after the `PubSub` child.

```elixir
    children = [
      ChatWeb.Telemetry,
      Chat.Repo,
      {Phoenix.PubSub, name: Chat.PubSub},
      ChatWeb.Presence,                 # add this line
      ChatWeb.Endpoint
    ]
```

And we're done! 🎉

We can now freely use `Presence`
by importing `alias ChatWeb.Presence`
in `lib/chat_web/channels/room_channel.ex`.



# Phoenix Chat Example

A Step-by-Step Tutorial for building, testing
and _deploying_ a Chat app in Phoenix!


## Why?

Chat apps are the "Hello World" of "real time" example apps. <br />

Most example apps show a few basics and then ignore "the rest" ... <br />
So "_beginners_" are often left "_lost_" or "_confused_" as to
what they should _do_ or learn _next_!
Very _few_ tutorials consider Testing,
Deployment, Documentation or other "Enhancements" which are
all part of the "Real World" of building and running apps;
so those are topics we _will_ cover to "_fill in the gaps_".

We wrote this is tutorial to be _easiest_ way to learn about Phoenix,
Ecto and "Channles" with a _practical_ example you can follow.


## What?

A simple step-by-step tutorial showing you how to:

+ Create a Phoenix App from scratch (_using the `phx.new` "generator" command_)
+ Add a "Channel" so your app can communicate over "WebSockets".
+ Implement a _basic_ "front-end" in "plain" JavaScript to interact with Phoenix.
+ Add a simple "Ecto" schema to define the Database Table (_to store messages_)
+ Write the "CRUD" to save message/sender data to a database table.
+ Test that everything is working.
+ Deploy to Heroku so people can try out your creation!

_Initially_, we _deliberately_ skip over configuration files,
"_Phoenix Internals_" and other
because you _don't_ need to know about them to get _started_.
But don't worry, we will return to them when _needed_.
We favour "_just-in-time_" (_when you need it_) learning
as it's _immediately_ obvious and _practical_ ***why***
we are learning something.


## Who?

This example is for ***complete beginners***
as a "***My First Phoenix***" App. <br />

We try to _assume_ as little as possible,
but if think we "_skipped a step_"
or  you feel "_stuck_" for any reason,
or have _any_ questions, please open an issue on GitHub! <br />
Both the @dwyl and Phoenix communities are super beginner-friendly,
so don't be afraid/shy. By asking questions, you are helping everyone
that is or might be stuck with the same thing!
+ **Chat App _specific_** questions:
https://github.com/nelsonic/phoenix-chat-example
+ _General_ Learning Phoenix questions:
https://github.com/dwyl/learn-phoenix-framework/issues


# How?

These instructions show you how to _create_ the Chat app
_from scratch_.

If you prefer to _run_ the existing/sample app,
scroll down to the "Clone Repo and Run on Localhost" section instead.


## 0. Pre-requisites (_Before you Start_)

1. **Elixir _Installed_** on your **local machine**. <br />
see: https://github.com/dwyl/learn-elixir#installation
<br />
e.g:
```sh
brew install elixir
```
2. **Phoenix** framework **installed**.
see: https://hexdocs.pm/phoenix/installation.html
<br />
e.g:
```sh
mix archive.install https://github.com/phoenixframework/archives/raw/master/phx_new.ez
```
3. PostgreSQL (Database Server) installed (_to save chat messages_) <br />
see: https://github.com/dwyl/learn-postgresql#installation
4. Basic **Elixir Syntax** knowledge will help, <br />
see: https://elixir-lang.org/getting-started/introduction.html
5. Basic **JavaScript** knowledge is advantageous. <br />
see: https://github.com/iteles/Javascript-the-Good-Parts-notes


### Check You Have Everything _Before_ Starting

Check you have the latest version of Elixir:
```sh
elixir -v
```

You should see something like:
```sh
Erlang/OTP 20 [erts-9.2] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:10] [hipe] [kernel-poll:false] [dtrace]

Elixir 1.5.3
```

Check you have the **latest** version of **Phoenix**:
```sh
mix phx.new -v
```
You should see:
```sh
Phoenix v1.3.0
```


## 1. Create The App

In your terminal on localhost,
type the following command to create the app.

```sh
mix phx.new chat
```
That will create the directory structure and files. <br />

When asked to "Fetch and install dependencies? [Yn]",<br />
Type "y" in your terminal,
followed by the `[Enter]` / `[Return]` key.

You should see:
![fetch-and-install-dependencies](https://user-images.githubusercontent.com/194400/34833220-d219221c-f6e6-11e7-88d6-87aa4c3054e4.png)


## 2. Create the (WebSocket) "Channel"

Generate the (WebSocket) channel to be used in the chat app:

```sh
mix phx.gen.channel chat_room
```

This will create a couple of files:<br />
```sh
* creating lib/chat_web/channels/chat_room_channel.ex
* creating test/chat_web/channels/chat_room_channel_test.exs
```

And inform you that you need to copy-paste a piece of code into your app: <br />
```sh
Add the channel to your `/lib/chat_web/channels/user_socket.ex` handler, for example:

    channel "chat_room:lobby", ChatWeb.ChatRoomChannel
```

Open the file called `/lib/chat_web/channels/user_socket.ex` <br >
and change the line:
```elixir
# channel "room:*", ChatWeb.RoomChannel
```
to:
```elixir
channel "chat_room:lobby", ChatWeb.ChatRoomChannel
```
Example:
[user_socket.ex#L5](https://github.com/nelsonic/phoenix-chat-example/blob/b9c1d4f719e9ebbd5580dd0941bec8bac50030bf/lib/chat_web/channels/user_socket.ex#L5)


## 3. Update the Template File (UI)

Open the the `/lib/chat_web/templates/page/index.html.eex` file <br />
and _copy-paste_ (_or type_) the following code:

```html
<!-- The list of messages will appear here: -->
<ul id='msg-list' class='row' style='list-style: none; min-height:200px; padding: 10px;'></ul>

<div class="row">
  <div class="col-xs-3">
    <input type="text" id="name" class="form-control" placeholder="Your Name" autofocus>
  </div>
  <div class="col-xs-9">
    <input type="text" id="msg" class="form-control" placeholder="Your Message">
  </div>
</div>
```

This is the _basic_ form we will use to input Chat messages.
The classes e.g: `"form-control"` and `"col-xs-3"`
are Bootstrap CSS classes to _style_ the form.
Phoenix includes Bootstrap by default so you can get up-and-running
with your App/Idea/"MVP" as quickly as possible! <br />
If you are unfamiliar with Bootstrap UI,
read: https://getbootstrap.com/docs/3.3 <br />
and if you _specifically_ want to understand the Bootstrap _forms_,
see: https://getbootstrap.com/docs/3.3/css/#forms


## 4. Update the "Client" code in App.js

Open:
`/assets/js/app.js`
and uncomment the line:
```js
import socket from "./socket"
```
with the line _uncommented_ our app will import the `socket.js` file
which will give us WebSocket functionality.

Then add the following JavaScript ("Client") code:

```js
var channel = socket.channel('chat_room:lobby', {}); // connect to chat room
var msg = document.getElementById('msg');
var name = document.getElementById('name');
var ul = document.getElementById('msg-list');

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) {
      channel.push('shout', {
          name: name.value,
          message: msg.value
      });
      msg.value = ''; // reset the message input field for next message.
  }
});

// listen to the 'shout'
channel.on('shout', function (payload) {
  var li = document.createElement("li"); // creaet new list item
  li.innerHTML = '<b>' + (payload.name || 'guest') + '</b>: ' + payload.message;
  ul.appendChild(li); // append to list
});

channel
    .join()
    .receive('ok', resp => {
        console.log('Joined successfully', resp);
    })
    .receive('error', resp => {
        console.log('Unable to join', resp);
    });
```


## 5. _Checkpoint_: Our Chat App Already Works! _Try it_!

At this point our Chat App already "works"!
Try it!

Run the following terminal command:
```sh
mix phx.server
```




# Storing Chat Data

If we didn't want to _save_ the chat history,
we could


## 7. Create/Configure Database

Follow the steps/instructions given in your terminal:

Change into the project directory if you haven't already.

```sh
cd chat
```
> Note: if you cloned this project from GitHub instead creating it from scratch,
> run: `cd phoenix-chat-example` instead. The rest is the same.

```sh
mix ecto.create
```
You should see:
```sh
The database for Chat.Repo has been created
```

## 8. Generate Database Schema to Store Chat History

Run the following command in your terminal:
```sh
mix phx.gen.schema Message messages name:string message:string
```
You should see the following output:
```sh
* creating lib/chat/message.ex
* creating priv/repo/migrations/20180107074333_create_messages.exs

Remember to update your repository by running migrations:

    $ mix ecto.migrate
```

Let's break down that command for clarity:
+ `mix phx.gen.schema` - the mix command to create a new schema (database table)
+ `Message` - the singular name for record in our messages "collection"
+ `messages` - the name of the collection (_or database table_)
+ `name:string` - the name of the person sending a message, stored as a `string`.
+ `message:string` - the message sent by the person, also stored as a `string`.

The `creating lib/chat/message.ex` file is the "schema"
for our Message database table.

And the `creating priv/repo/migrations/20180107074333_create_messages.exs` file
is the "_migration_" that _creates_ the database table in our chose database.

#### 6.1 Confirm Your PostgreSQL Configuration




#### 6.2 Run the Ecto Migration

In your terminal run the following command to create the Message

```sh
mix ecto.migrate
```
You should see the following in your terminal:
```sh
Compiling 1 file (.ex)
Generated chat app
[info] == Running Chat.Repo.Migrations.CreateMessages.change/0 forward
[info] create table messages
[info] == Migrated in 0.0s
```

#### 6.3 Review the Messages Table Schema

If you open your PostgreSQL GUI (_we use `Postico`_)
you will see that the messages table has been created:

![messages-table-schema-postico](https://user-images.githubusercontent.com/194400/34839040-2c6fcd0e-f6f8-11e7-807f-eb5e81b4192b.png)


### 7. Save Messages to Database

Open the `lib/chat_web/channels/chat_room_channel.ex` file
and inside the function `def handle_in("shout", payload, socket) do`
add the following line:
```elixir
Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert  
```

So that your function ends up looking like this:
```elixir
def handle_in("shout", payload, socket) do
  Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert  
  broadcast socket, "shout", payload
  {:noreply, socket}
end
```

### 8. Load Existing Messages

Open the `lib/chat/message.ex` file and add a new function to it:
```elixir
def get_messages(limit \\ 20) do
  Chat.Repo.all(Message, limit: limit)
end
```
This function accepts a single parameter `limit` to only return a fixed/maximum
number of records.
It uses Ecto's `all` function to fetch all records from the database.
`Message` is the name of the schema/table we want to get records for,
and limit is the maximum number of records to fetch.


### 9. Send Existing Messages to the Client when they Join

In the `/lib/chat_web/channels/chat_room_channel.ex` file create a new function:
```elixir
def handle_info(:after_join, socket) do
  Chat.Message.get_messages()
  |> Enum.each(fn msg -> push(socket, "shout", %{
      name: msg.name,
      message: msg.message,
    }) end)
  {:noreply, socket} # :noreply
end
```

and at the top of the file in the `join` function,

```elixir
def join("chat_room:lobby", payload, socket) do
  if authorized?(payload) do
    send(self(), :after_join)
    {:ok, socket}
  else
    {:error, %{reason: "unauthorized"}}
  end
end
```


### X. Testing!

https://hexdocs.pm/phoenix/testing_channels.html

### X. Start Server

```sh
mix phx.server
```


To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).




## Inspiration

This repo is inspired by @chrismccord's Simple Chat Example:
https://github.com/chrismccord/phoenix_chat_example

At the time of writing Chris' example is still
[Phoenix 1.2](https://github.com/chrismccord/phoenix_chat_example/blob/31f0c5f80a04af0a05fdec89d5b428880c4ea814/mix.exs#L25)
see: https://github.com/chrismccord/phoenix_chat_example/issues/40
therefore we decided to write a quick version for Phoenix 1.3 :-)


## Learn more

* Official website: http://www.phoenixframework.org/
* Guides: http://phoenixframework.org/docs/overview
* Docs: https://hexdocs.pm/phoenix
* Mailing list: http://groups.google.com/group/phoenix-talk
* Source: https://github.com/phoenixframework/phoenix

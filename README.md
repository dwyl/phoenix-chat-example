<div align="center">

# Phoenix Chat Example

![phoenix-chat-logo](https://user-images.githubusercontent.com/194400/39481553-c448aa1c-4d63-11e8-9389-47789833a96e.png)


![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dwyl/phoenix-chat-example/Elixir%20CI?label=build&style=flat-square)
[![codecov.io](https://img.shields.io/codecov/c/github/dwyl/phoenix-chat-example/main.svg?style=flat-square)](https://codecov.io/github/dwyl/phoenix-chat-example?branch=main)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/dwyl/phoenix-chat-example/issues)
[![HitCount](https://hits.dwyl.com/dwyl/phoenix-chat-example.svg)](https://github.com/dwyl/phoenix-chat-example)
[![Hex pm](https://img.shields.io/hexpm/v/phoenix.svg?style=flat-square)](https://hex.pm/packages/phoenix)
_Try_ it: https://phxchat.herokuapp.com
<!-- [![Deps Status](https://beta.hexfaktor.org/badge/all/github/dwyl/phoenix-chat-example.svg?style=flat-square)](https://beta.hexfaktor.org/github/dwyl/phoenix-chat-example) -->
<!-- [![Inline docs](https://inch-ci.org/github/dwyl/phoenix-chat-example.svg?style=flat-square)](https://inch-ci.org/github/dwyl/phoenix-chat-example) -->
<!-- wake Heroku app so it loads faster! see: https://github.com/dwyl/ping -->
![wake-sleeping-heroku-app](https://phxtodo.herokuapp.com/ping)



A ***step-by-step tutorial*** for building, testing
and _deploying_ a Chat app in Phoenix!

</div>

## Content
- [Why?](#why)
- [What?](#what)
- [Who?](#who)
- [How?](#how)
  - [0. Pre-requisites (Before you Start)](#0-pre-requisites-before-you-start)
  - [1. Create the App](#1-create-the-app)
  - [2. Create the (Websocket) "Channel"](#2-create-the-websocket-channel)
  - [3. Update the Template File (UI)](#3-update-the-template-file-ui)
    - [3.1 Update Layout Template](#31-update-layout-template)
    - [3.2 Update the page_controller_test.exs](#32-update-the-page_controller_testexs)
  - [4. Update the "Client" code in App.js](#4-update-the-client-code-in-appjs)
    - [4.1 Comment out lines in `socket.js`](#41-comment-out-lines-in-socketjs)
  - [5. Generate Database Schema to Store Chat History](#5-generate-database-schema-to-store-chat-history)
  - [6. Run the Ecto Migration (Create The Database Table)](#6-run-the-ecto-migration-create-the-database-table)
  - [7. Insert Messages into Database](#7-insert-messages-into-database)
  - [8. Load Existing Messages (When Someone Joins the Chat)](#8-load-existing-messages-when-someone-joins-the-chat)
  - [9. Send Existing Messages to the Client when they Join](#9-send-existing-messages-to-the-client-when-they-join)
  - [10. Checkpoint: Our Chat App Saves Messages!! (Try it!)](#10-checkpoint-our-chat-app-saves-messages-try-it)
- [Testing our App (Automated Testing)](#testing-our-app-automated-testing)
  - [11. Run the Default/Generated Tests](#11-run-the-defaultgenerated-tests)
  - [12. Understanding The Channel Tests](#12-understanding-the-channel-tests)
  - [13. What is Not Tested?](#13-what-is-not-tested)
    - [13.1 Add excoveralls as a (Development) Dependency to mix.exs](#131-add-excoveralls-as-a-development-dependency-to-mixexs)
    - [13.2 Create a New File Called coveralls.json](#132-create-a-new-file-called-coverallsjson)
    - [13.3 Run the Tests with Coverage Checking](#133-run-the-tests-with-coverage-checking)
    - [13.4 Write a Test for the Untested Function](#134-write-a-test-for-the-untested-function)
- [Continuous Integration](#continuous-integration)
- [Deployment!](#deployment)
- [Inspiration](#inspiration)
- [Recommended Reading/Learning](#recommended-reading--learning)

## Why?

Chat apps are the "Hello World" of "real time" examples. <br />

_Sadly, most_ example apps show a few basics and then _ignore_ "_the rest_" ... <br />
So "_beginners_" are often left "_lost_" or "_confused_" as to
what they should _do_ or learn _next_! <br />
Very _few_ tutorials consider **Testing,
Deployment, Documentation** or _other_ "**Enhancements**" which are
all part of the "***Real World***" of building and running apps;
so those are topics we **_will_ cover** to "_fill in the gaps_".

We wrote _this_ tutorial to be _easiest_ way to learn Phoenix,
Ecto and "Channels" with a _practical_ example _anyone_ can follow.



## What?

A simple step-by-step tutorial showing you how to:

+ **Create** a **Phoenix App** from _scratch_
(_using the `mix phx.new chat` "generator" command_)
+ Add a "Channel" so your app can communicate over "**WebSockets**".
+ Implement a _basic_ "***front-end***" in "_plain_" JavaScript
(_ES5 without any libraries_) to interact with Phoenix
(_send/receive messages via WebSockets_)
+ Add a simple "**Ecto**" **schema** to define
the **Database Table** (_to store messages_)
+ **Write** the functions ("CRUD") to _save_
message/sender data to a database table.
+ **Test** that everything is working as expected.
+ ***Deploy*** to Heroku so you can _show_ people your creation!

_Initially_, we _deliberately_ skip over configuration files
and "_Phoenix Internals_"
because you (_beginners_) _don't need_ to know about them to get _started_.
But don't worry, we will return to them when _needed_.
We favour "_just-in-time_" (_when you need it_) learning
as it's _immediately_ obvious and _practical_ ***why***
we are learning something.


## Who?

This example is for ***complete beginners***
as a "***My First Phoenix***" App. <br />

We try to _assume_ as little as possible,
but if you think we "_skipped a step_"
or  you feel "_stuck_" for any reason,
or have _any_ questions (_related to this example_),
please open an issue on GitHub! <br />
Both the @dwyl and Phoenix communities are _super **beginner-friendly**_,
so don't be afraid/shy. <br />
Also, by asking questions, you are helping everyone
that is or might be stuck with the _same_ thing!
+ **Chat App _specific_** questions:
https://github.com/dwyl/phoenix-chat-example/issues
+ **General** Learning Phoenix questions:
https://github.com/dwyl/learn-phoenix-framework/issues


# _How_?

These instructions show you how to _create_ the Chat app
_from scratch_.
<!--
If you prefer to _run_ the existing/sample app,
scroll down to the "Clone Repo and Run on Localhost" section instead.
-->

## 0. Pre-requisites (_Before you Start_)

1. **Elixir _Installed_** on your **local machine**. <br />
  see: https://github.com/dwyl/learn-elixir#installation <br />
  e.g: <br />
```
brew install elixir
```
> _**Note**: if you already have `Elixir` installed on your Mac,
  and just want to upgrade to the latest version, run:_
  **`brew upgrade elixir`**


2. **Phoenix** framework **installed**.
  see: https://hexdocs.pm/phoenix/installation.html <br />
  e.g: <br />
```
mix archive.install hex phx_new 1.6.2
```

3. PostgreSQL (Database Server) installed (_to save chat messages_) <br />
see: [https://github.com/dwyl/**learn-postgresql#installation**](https://github.com/dwyl/learn-postgresql#installation)

<!-- update instructions to https://hexdocs.pm/phoenix/installation.html -->

4. Basic **Elixir Syntax** knowledge will help,<br />
please see:
[https://github.com/dwyl/**learn-elixir**](https://github.com/dwyl/learn-elixir)

5. Basic **JavaScript** knowledge is _advantageous_
(_but not essential as the "front-end" code
is quite basic and well-commented_).
see: https://github.com/iteles/Javascript-the-Good-Parts-notes


### _Check_ You Have Everything _Before_ Starting

Check you have the _latest version_ of **Elixir**
(_run the following command in your terminal_):
```sh
elixir -v
```

You should see something like:
```sh
Erlang/OTP 24 [erts-12.1.2] [source] [64-bit] [smp:12:12] [ds:12:12:10] [async-threads:1] [jit]

Elixir 1.12.3 (compiled with Erlang/OTP 22)
```

Check you have the **latest** version of **Phoenix**:
```sh
mix phx.new -v
```
You should see:
```sh
Phoenix v1.6.2
```

_Confirm_ **PostgreSQL** is running (_so the App can store chat messages_)
run the following command:
```sh
lsof -i :5432
```
You should see output _similar_ to the following:
```sh
COMMAND  PID  USER   FD  TYPE DEVICE                  SIZE/OFF NODE NAME
postgres 529 Nelson  5u  IPv6 0xbc5d729e529f062b      0t0  TCP localhost:postgresql (LISTEN)
postgres 529 Nelson  6u  IPv4 0xbc5d729e55a89a13      0t0  TCP localhost:postgresql (LISTEN)
```
This tells us that PostgreSQL is "_listening_" on TCP Port `5432`
(_the default port_)

With all those "pre-flight checks" performed, let's get _going_!

## First _Run_ the _Finished_ App

_Before_ you attempt to build the Chat App from scratch,
clone and run the _finished_ working version
to get an idea of what to expect.

### Clone the Project:

In your terminal run the following command to clone the repo:

```sh
git clone git@github.com:dwyl/phoenix-chat-example.git
```

### Install the Dependencies

Change into the `phoenix-chat-example` directory
and install both the `Elixir` and `Node.js` dependencies
with this command:

```sh
cd phoenix-chat-example
mix setup
```

<!-- ### TODO: Add auth step? -->


### Run the App

Run the Phoenix app with the command:

```sh
mix phx.server
```

If you open the app
[localhost:4000](http://localhost:4000)
in two more web browsers,
you can see the chat messages
displayed in all of them
as soon as you hit the <kbd>Enter</kbd> key:

![phoenix-chat-localhost-demo-optimised](https://user-images.githubusercontent.com/194400/84203142-d861d180-aaa0-11ea-8f10-abff03c3b4d2.gif)

<br />

Now that you have confirmed that the _finished_
phoenix chat app works on your machine,
it's time to _build_ it from scratch!

Change directory:

```sh
cd ..
```

And start building!


<br />

## 1. _Create_ The _App_

In your terminal program on your localhost,
type the following command to create the app:

```sh
mix phx.new chat
```
That will create the directory structure and project files. <br />


When asked to "***Fetch and install dependencies***? [Yn]",<br />
Type <kbd>Y</kbd> in your terminal,
followed by the <kbd>Enter</kbd> (<kbd>Return</kbd>) key.

You should see: <br />
![fetch-and-install-dependencies](https://user-images.githubusercontent.com/194400/34833220-d219221c-f6e6-11e7-88d6-87aa4c3054e4.png)

Change directory into the `chat` directory by running the suggested command:
```sh
cd chat
```

Now run the following command:
```sh
mix setup
```

> _**Note**: at this point there is already an "App"
it just does not **do** anything (yet) ... <br />
you **can** run `mix phx.server`
in your terminal - don't worry if you're seeing error <br />
messages, this is because we haven't created our database yet. <br />
We will take care of that in [step 6](#6-createconfigure-database)!<br />
For now, open [http://localhost:4000](http://localhost:4000)
in your browser <br />
and you will see the `default`
"Welcome to Phoenix" homepage:_ <br />

![welcome-to-phoenix](https://user-images.githubusercontent.com/194400/82494801-11caa100-9ae2-11ea-821d-8181580201cb.png)

Shut down the Phoenix server in your terminal
with the
<kbd>ctrl</kbd>+<kbd>C</kbd>
command.

### Run the Tests

In your terminal window, run the following command:

```
mix test
```

You should see output similar to the following:

```sh
Generated chat app

21:41:27.079 [info]  Already up
...

Finished in 0.07 seconds
3 tests, 0 failures

Randomized with seed 273499
```

Now that we have confirmed that everything is working (all tests pass),
let's continue to the _interesting_ part!

<br />

## 2. _Create_ the (WebSocket) "_Channel_"

Generate the (WebSocket) channel to be used in the chat app:

```sh
mix phx.gen.channel Room
```

> If you are prompted to confirm installation,
type `y` and hit the `[Enter]` key.

This will create **two files**:<br />

```sh
* creating lib/chat_web/channels/room_channel.ex
* creating test/chat_web/channels/room_channel_test.exs
```

The `room_channel.ex` file handles receiving/sending messages
and the `room_channel_test.exs` tests basic interaction with the channel.
(_Don't worry about this yet, we will look at the test file in step 14 below_!)

We are informed that we need to update a piece of code into your app: <br />

```sh
Add the channel to your `/lib/chat_web/channels/user_socket.ex` handler, for example:

    channel "room:lobby", ChatWeb.RoomChannel
```

Open the file called `/lib/chat_web/channels/user_socket.ex` <br >
and change the line:

```elixir
# channel "room:*", ChatWeb.RoomChannel
```

to:

```elixir
channel "room:lobby", ChatWeb.RoomChannel
```

Example:
[user_socket.ex#L5](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/lib/chat_web/channels/user_socket.ex#L5)

> For more detail on Phoenix Channels,
(_we highly recommend you_) read:
https://hexdocs.pm/phoenix/channels.html


<br />

## 3. Update the Template File (UI)

Open the the
[`/lib/chat_web/templates/page/index.html.eex`](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/lib/chat_web/templates/page/index.html.eex)
file <br />
and _copy-paste_ (_or type_) the following code:

```html
<!-- The list of messages will appear here: -->
<ul id="msg-list" style="list-style: none; min-height:200px;">
</ul>

<div class="row">
  <div class="col-xs-3" style="width: 20%; margin-left: 0;">
    <input type="text" id="name" class="form-control" placeholder="Your Name" style="border: 1px black solid; font-size: 1.3em;" autofocus>
  </div>
  <div class="col-xs-9" style="width: 100%; margin-left: 1%; ">
    <input type="text" id="msg" class="form-control" placeholder="Your Message" style="border: 1px black solid; font-size: 1.3em;">
  </div>
</div>
```

This is the _basic_ form we will use to input Chat messages. <br />
The classes e.g: `"column"` and `"column-20"`
are [Milligram CSS](https://milligram.io/grids.html)
classes to _style_ the form. <br />
Phoenix includes Milligram by default so you can get up-and-running
with your App/Idea/"MVP"! <br />
If you are unfamiliar with Milligram,
read: https://milligram.io/#typography <br />
and if you _specifically_ want to understand the Milligram _forms_,
see: https://milligram.io/#forms

Your `index.html.eex` template file should look like this:
[`/lib/chat_web/templates/page/index.html.eex`](https://github.com/dwyl/phoenix-chat-example/blob/7e9d5f0e8fd69d3c13f6fe7814d81a9d7ec602ca/lib/chat_web/templates/page/index.html.eex) (_snapshot_)


### 3.1 Update Layout Template

Open the `lib/chat_web/templates/layout/app.html.eex` file
and locate the `<header>` tag.
Replace the contents of the `<header>` with the following code:

```html
<section class="container">
  <nav role="navigation">
    <h1 style="padding-top: 15px">Chat Example</h1>
  </nav>
    <img src="<%= Routes.static_path(@conn, "/images/phoenix.png") %>"
    width="500px" alt="Phoenix Framework Logo" />
</section>
```

Your `app.html.eex` template file should look like this:
[`/lib/chat_web/templates/page/index.html.eex`]() (_snapshot_)

At the end of this step, if you run the Phoenix Server `mix phx.server`,
and view the App in your browser it will look like this:

![phoenix-chat-blank](https://user-images.githubusercontent.com/194400/82498454-ef3b8680-9ae7-11ea-9d1f-8cf593deacba.png)

So it's already starting to look like a basic Chat App.
Sadly, since we changed the copy of the `index.html.eex`
our `page_controller_test.exs` now fails:

Run the command:

```sh
mix test
```

```
1) test GET / (ChatWeb.PageControllerTest)
     test/chat_web/controllers/page_controller_test.exs:4
     Assertion with =~ failed
     code:  assert html_response(conn, 200) =~ "Welcome to Phoenix!"
```

Thankfully this is easy to fix.


### 3.2 Update the `page_controller_test.exs`

Open the `test/chat_web/controllers/page_controller_test.exs` file
and replace the line:

```elixir
assert html_response(conn, 200) =~ "Welcome to Phoenix!"
```

With:

```elixir
assert html_response(conn, 200) =~ "Chat Example"
```

Now if you run the tests again, they will pass:
```
mix test
```

Sample output:

```
22:22:43.076 [info]  Already up
......

Finished in 0.1 seconds
6 tests, 0 failures
```

<br />

## 4. Update the "Client" code in App.js

Open the
`/assets/js/app.js`
file and uncomment the line:

```js
import socket from "./socket"
```

with the line _uncommented_ our app will import the `socket.js` file
which will give us WebSocket functionality.

Then add the following JavaScript ("Client") code:

```js
let channel = socket.channel('room:lobby', {}); // connect to chat "room"

channel.on('shout', function (payload) { // listen to the 'shout' event
  let li = document.createElement("li"); // create new list item DOM element
  let name = payload.name || 'guest';    // get name from payload or set default
  li.innerHTML = '<b>' + name + '</b>: ' + payload.message; // set li contents
  ul.appendChild(li);                    // append to list
});

channel.join(); // join the channel.


let ul = document.getElementById('msg-list');        // list of messages.
let name = document.getElementById('name');          // name of message sender
let msg = document.getElementById('msg');            // message input field

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    channel.push('shout', { // send the message to the server on "shout" channel
      name: name.value || "guest",     // get value of "name" of person sending the message. Set guest as default
      message: msg.value    // get message text (value) from msg input field.
    });
    msg.value = '';         // reset the message input field for next message.
  }
});
```

> Take a moment to read the JavaScript code
and confirm your understanding of what it's doing. <br />
Hopefully the in-line comments are self-explanatory,
but if _anything_ is unclear, please ask!

At this point your `app.js` file should look like this:
[`/assets/js/app.js`](https://github.com/dwyl/phoenix-chat-example/blob/7c3f94f127adfac05fe6b11a4ba3196802d9cfe2/assets/js/app.js)


### 4.1 Comment Out Lines in `socket.js`

By default the phoenix channel (client)
will subscribe to the generic room: `"topic:subtopic"`.
Since we aren't going to be using this,
we can avoid seeing any
**`"unable to join: unmatched topic"`** errors in our browser/console
by simply commenting out a few lines in the `socket.js` file.
Open the file in your editor and locate the following lines:

```JavaScript
let channel = socket.channel("topic:subtopic", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })
```
Comment out the lines so they will not be executed:

```JavaScript
// let channel = socket.channel("topic:subtopic", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })
```

Your `socket.js` should now look like this:
[`/assets/js/socket.js`](https://github.com/dwyl/phoenix-chat-example/blob/26f98f2dbca061f6cc383dfd99861325113eaf1b/assets/js/socket.js)

> If you later decide to tidy up your chat app, you can **`delete`**
these commented lines from the file. <br />
We are just keeping them for reference
of how to join channels and receive messages.

Once that's done, proceed to the next step!

<br />

<!-- Remove if no longer required as mix setup in step 1 covers this.
## 5. Install the Node.js Dependencies

In order to use JavaScript in your Phoenix project,
you need to install the node.js dependencies:

```sh
mix setup
```

That might take a few seconds (_depending on your internet connection speed_)

But once it completes you should see:
```sh
added 1022 packages from 600 contributors and audited 14893 packages in 32.079s
found 0 vulnerabilities
```
 -->


### Storing Chat Message Data/History

If we didn't _want_ to _save_ the chat history,
we could just _deploy_ this App _immediately_
and we'd be done! <br />

> In fact, it could be a "_use-case_" / "_feature_"
to have "_ephemeral_" chat without _any_ history ...
> see: http://www.psstchat.com/
![psst-chat](https://user-images.githubusercontent.com/194400/35284714-6e338596-0053-11e8-998a-83b917ec90ae.png)
> but we are _assuming_ that _most_ chat apps save history
> so that `new` people joining the "channel" can see the history
> and people who are briefly "absent" can "catch up" on the history.

<br />

## 5. Generate Database Schema to Store Chat History

Run the following command in your terminal:
```sh
mix phx.gen.schema Message messages name:string message:string
```
You should see the following output:
```sh
* creating lib/chat/message.ex
* creating priv/repo/migrations/20200607184409_create_messages.exs

Remember to update your repository by running migrations:

    $ mix ecto.migrate
```

Let's break down that command for clarity:
+ `mix phx.gen.schema` - the mix command to create a new schema (database table)
+ `Message` - the singular name for record in our messages "collection"
+ `messages` - the name of the collection (_or database table_)
+ `name:string` - the name of the person sending a message, stored as a `string`.
+ `message:string` - the message sent by the person, also stored as a `string`.

The line `creating lib/chat/message.ex` creates the "schema"
for our Message database table.

Additionally a migration file is created, e.g:
`creating priv/repo/migrations/20200607184409_create_messages.exs`
The "_migration_" actually _creates_ the database table in our database.

<br />

## 6. Run the Ecto Migration (_Create The Database Table_)

In your terminal run the following command to create the `messages` table:

```sh
mix ecto.migrate
```
You should see the following in your terminal:
```sh
Compiling 16 files (.ex)
Generated chat app

19:47:14.215 [info]  == Running 20200607184409 Chat.Repo.Migrations.CreateMessages.change/0 forward

19:47:14.219 [info]  create table messages

19:47:14.275 [info]  == Migrated 20200607184409 in 0.0s
```

<br />

### 6.1 Review the Messages Table Schema

If you open your PostgreSQL GUI (_e.g: [pgadmin](https://www.pgadmin.org)_)
you will see that the messages table has been created
in the `chat_dev` database:

![pgadmin-messages-table](https://user-images.githubusercontent.com/194400/35624169-deaa7fd4-0696-11e8-8dd0-584eba3a2037.png)

You can view the table schema by "_right-clicking_" (_`ctrl + click` on Mac_)
on the `messages` table and selecting "properties":

![pgadmin-messages-schema-columns-view](https://user-images.githubusercontent.com/194400/35623295-c3a4df5c-0693-11e8-8484-199c2bcab458.png)

<br />

## 7. Insert Messages into Database

Open the `lib/chat_web/channels/room_channel.ex` file
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

<br />


## 8. Load _Existing_ Messages (_When Someone Joins the Chat_)

Open the `lib/chat/message.ex` file and import `Ecto.Query`:

```elixir
defmodule Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query # add Ecto.Query

```

Then add a new function to it:

```elixir
def get_messages(limit \\ 20) do
  Chat.Message
  |> limit(^limit)
  |> order_by(desc: :inserted_at)
  |> Chat.Repo.all()
end
```
This function accepts a single parameter `limit` to only return a fixed/maximum
number of records.
It uses Ecto's `all` function to fetch all records from the database.
`Message` is the name of the schema/table we want to get records for,
and limit is the maximum number of records to fetch.

<br />

## 9. Send Existing Messages to the Client when they Join

In the `/lib/chat_web/channels/room_channel.ex` file create a new function:
```elixir
def handle_info(:after_join, socket) do
  Chat.Message.get_messages()
  |> Enum.reverse() # revers to display the latest message at the bottom of the page
  |> Enum.each(fn msg -> push(socket, "shout", %{
      name: msg.name,
      message: msg.message,
    }) end)
  {:noreply, socket} # :noreply
end
```

and at the top of the file update the `join` function to the following:

```elixir
def join("room:lobby", payload, socket) do
  if authorized?(payload) do
    send(self(), :after_join)
    {:ok, socket}
  else
    {:error, %{reason: "unauthorized"}}
  end
end
```

<br />


## 10. _Checkpoint_: Our Chat App Saves Messages!! (_Try it_!)

Start the Phoenix server (_if it is not already running_):
```sh
mix phx.server
```

> _**Note**: it will take a few seconds to **compile**_.


In your terminal, you should see:
```sh
[info] Running ChatWeb.Endpoint with cowboy 2.8.0 at 0.0.0.0:4000 (http)
[info] Access ChatWeb.Endpoint at http://localhost:4000

webpack is watching the files…
```

This tells us that our code compiled (_as expected_) and the Chat App
is running on TCP Port `4000`!

**Open** the Chat web app in
**two _separate_ browser windows**: http://localhost:4000 <br />
(_if your machine only has one browser try using one "incognito" tab_)

You should be able to send messages between the two browser windows: <br />
![phoenix-chat-example-basic-cropped](https://user-images.githubusercontent.com/194400/35188398-9998e10a-fe2c-11e7-9f69-2a3dfbae754d.gif)

Congratulations! You have a _working_ (_basic_) Chat App written in Phoenix!

The chat (message) history is _saved_!

This means you can _refresh_ the browser
_or_ join in a different browser and you will still see the history!

<br />

# Testing our App (_Automated Testing_)

Automated testing is one of the _best_ ways to ensure _reliability_
in your web applications.

> _**Note**: If you are completely new to Automated Testing
or "Test Driven Development" ("TDD"),
we recommend reading/following the "basic" tutorial:_
[github.com/dwyl/**learn-tdd**](https://github.com/dwyl/learn-tdd)

Testing in Phoenix is fast (_tests run in parallel!_)
and easy to get started!
The `ExUnit` testing framework is _built-in_
so there aren't an "decisions/debates"
about which framework or style to use.

If you have never seen or written a test with `ExUnit`,
don't fear, the syntax should be _familiar_ if you have
written _any_ sort of automated test in the past.

<br />

## 11. Run the Default/Generated Tests

Whenever you create a new Phoenix app
or add a new feature (_like a channel_),
Phoenix _generates_ a new test for you.

We _run_ the tests using the **`mix test`** command:

```elixir
22:37:03.724 [info]  Already up
......

Finished in 0.1 seconds
6 tests, 0 failures

Randomized with seed 906499
```

In this case _none_ of these tests fails. (_6 tests, **0 failure**_)


## 12. Understanding The Channel Tests

It's worth taking a moment (_or as long as you need_!)
to _understand_ what is going on in the
[`/room_channel_test.exs`](https://github.com/nelsonic/phoenix-chat-example/blob/master/test/chat_web/channels/room_channel_test.exs)
file. _Open_ it if you have not already, read the test descriptions & code.

> For a bit of _context_ we recommend reading:
[https://hexdocs.pm/phoenix/**testing_channels**.html](https://hexdocs.pm/phoenix/testing_channels.html)

### 12.1 _Analyse_ a Test

Let's take a look at the _first_ test in
[/test/chat_web/channels/room_channel_test.exs#L14-L17](https://github.com/nelsonic/phoenix-chat-example/blob/f3823e64d9f9826db67f5cdf228ea5c974ad59fa/test/chat_web/channels/room_channel_test.exs#L14-L17):

```elixir
test "ping replies with status ok", %{socket: socket} do
  ref = push socket, "ping", %{"hello" => "there"}
  assert_reply ref, :ok, %{"hello" => "there"}
end
```
The test gets the `socket` from the `setup` function (_on line 6 of the file_)
and assigns the result of calling the `push` function to a variable `ref`
`push` merely _pushes_ a message (_the map `%{"hello" => "there"}`_)
on the `socket` to the `"ping"` ***topic***.

The [`handle_in`](https://github.com/nelsonic/phoenix-chat-example/blob/f3823e64d9f9826db67f5cdf228ea5c974ad59fa/lib/chat_web/channels/room_channel.ex#L13-L17)
function clause which handles the `"ping"` topic:

```elixir
def handle_in("ping", payload, socket) do
  {:reply, {:ok, payload}, socket}
end
```
Simply _replies_ with the payload you send it,
therefore in our _test_ we can use the `assert_reply` Macro
to assert that the `ref` is equal to `:ok, %{"hello" => "there"}`

> _**Note**: if you have questions or need **any** help
understanding the other tests, please open an issue on GitHub
we are happy to expand this further!_ <br />
(_we are just trying to keep this tutorial reasonably "brief"
so beginners are not "overwhelmed" by anything...)_

<br />

## 13. What is _Not_ Tested?

_Often_ we can learn a _lot_ about an application (_or API_)
from reading the tests and seeing where the "gaps" in testing are.

_Thankfully_ we can achieve this with only a couple of steps:

<br />

### 13.1 Add `excoveralls` as a (Development) Dependency to `mix.exs`

Open your `mix.exs` file and find the "deps" function:
```elixir
defp deps do
```

Add a comma to the end of the last line, then add the following line to the end
of the List:
```elixir
{:excoveralls, "~> 0.13.0", only: [:test, :dev]} # tracking test coverage
```

Additionally, find the `def project do` section (_towards the top of `mix.exs`_)
and add the following lines to the List:

```elixir
test_coverage: [tool: ExCoveralls],
preferred_cli_env: [coveralls: :test, "coveralls.detail": :test,
  "coveralls.post": :test, "coveralls.html": :test]
```

_Then_, ***install*** the dependency on `excoveralls`
we just added to `mix.exs`:

```sh
mix deps.get
```

You should see:

```sh
Resolving Hex dependencies...
Dependency resolution completed:
* Getting excoveralls (Hex package)
... etc.
```

### 13.2 Create a _New File_ Called `coveralls.json`

In the "root" (_base directory_) of the Chat project,
create a new file called `coveralls.json` and _copy-paste_ the following:

```json
{
  "coverage_options": {
    "minimum_coverage": 100
  },
  "skip_files": [
    "test/"
  ]
}
```
This file is quite basic, it instructs the `coveralls` app
to require a **`minimum_coverage`** of **100%**
(_i.e. **everything is tested**<sup>1</sup>_)
and to _ignore_ the files in the `test/` directory for coverage checking.

> <small>_<sup>1</sup>We believe that **investing**
a little **time up-front** to write tests for **all** our **code**
is **worth it** to have **fewer bugs** later. <br />
**Bugs** are **expensive**, **tests** are **cheap**
and **confidence**/**reliability** is **priceless**_. </small>


### 13.3 Run the Tests with Coverage Checking

To run the tests with coverage, copy-paste the following command
into your terminal:

```elixir
MIX_ENV=test mix do coveralls.json
```

You should see: <br />

```
Randomized with seed 68194
----------------
COV    FILE                                        LINES RELEVANT   MISSED
100.0% lib/chat.ex                                     9        0        0
100.0% lib/chat/message.ex                            22        3        0
100.0% lib/chat/repo.ex                                5        0        0
 66.7% lib/chat_web/channels/room_channel.ex          45        9        3
100.0% lib/chat_web/channels/user_socket.ex           35        0        0
100.0% lib/chat_web/controllers/page_controller        7        1        0
100.0% lib/chat_web/endpoint.ex                       54        0        0
100.0% lib/chat_web/gettext.ex                        24        0        0
100.0% lib/chat_web/views/error_view.ex               16        1        0
100.0% lib/chat_web/views/layout_view.ex               3        0        0
100.0% lib/chat_web/views/page_view.ex                 3        0        0
[TOTAL]  78.6%
----------------
```

As we can se here, only **78.6%** of lines of code in `/lib`
are being "covered" by the tests we have written.

To **view** the coverage in a web browser run the following:

```elixir
MIX_ENV=test mix coveralls.html ; open cover/excoveralls.html
```

<br />

This will open the Coverage Report (HTML) in your default Web Browser: <br />

![coverage-66-percent](https://user-images.githubusercontent.com/194400/83980823-a6ba0080-a910-11ea-93ab-46aba8b8ece3.png)


<!-- I think I'm at a point where I need to take a "Detour"
to write up my **Definitive** thoughts on "Test Coverage" once-and-for-all! -->


### 13.4 Write a Test for the Untested Function

Open the `test/chat_web/channels/room_channel_test.exs` file
and add the following test:

```elixir
test ":after_join sends all existing messages", %{socket: socket} do
  # insert a new message to send in the :after_join
  payload = %{name: "Alex", message: "test"}
  Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert()

  {:ok, _, socket2} = ChatWeb.UserSocket
    |> socket("user_id", %{some: :assign})
    |> subscribe_and_join(ChatWeb.RoomChannel, "room:lobby")

  assert socket2.join_ref != socket.join_ref
end
```

Now when you run `MIX_ENV=test mix do coveralls.json`
you should see:

```
Randomized with seed 232886
----------------
COV    FILE                                        LINES RELEVANT   MISSED
100.0% lib/chat.ex                                     9        0        0
100.0% lib/chat/message.ex                            22        3        0
100.0% lib/chat/repo.ex                                5        0        0
100.0% lib/chat_web/channels/room_channel.ex          46        9        0
100.0% lib/chat_web/channels/user_socket.ex           35        0        0
100.0% lib/chat_web/controllers/page_controller        7        1        0
100.0% lib/chat_web/endpoint.ex                       54        0        0
100.0% lib/chat_web/gettext.ex                        24        0        0
100.0% lib/chat_web/views/error_view.ex               16        1        0
100.0% lib/chat_web/views/layout_view.ex               3        0        0
100.0% lib/chat_web/views/page_view.ex                 3        0        0
[TOTAL] 100.0%
----------------
```

This test just creates a message before
the `subscribe_and_join` so there is a message in the database
to send out to any clien that joins the chat.

That way the `:after_join` has at least one message
and the `Enum.each` will be invoked at least once.

With that our app is fully tested!



<br />

# Continuous Integration

Continuous integration lets you _automate_ running the tests
to check/confirm that your app is working as _expected_ (_before deploying_).
This prevents accidentally "_breaking_" your app.

_Thankfully_ the steps are quite simple.

> _If you are `new` to Continuous Integration, or need a refresher,
we wrote a step-by-step tutorial for it!
see_:
[github.com/dwyl/**learn-travis**](https://github.com/dwyl/learn-travis)

The Elixir-specific section is:
https://github.com/dwyl/learn-travis#elixir-lang

We only need to add `.travis.yml` file to the project
with the following lines:
```yml
language: elixir
elixir: # Latest version of Elixir
  - 1.12.3
services: # ensure that Travis-CI provisions a DB for our test:
  - postgresql
env:
  - MIX_ENV=test
script: # run the tests:
  - mix test
```

You will need to _enable_ your project on Travis-CI
for the build to run. <br />
Please see: https://github.com/dwyl/learn-travis#getting-started

<br />

# Deployment!

Deployment to Heroku takes a few minutes,
but has a few "steps",
therefore we have created a _separate_
guide for it:
 [elixir-phoenix-app-deployment.md](https://github.com/dwyl/learn-heroku/blob/master/elixir-phoenix-app-deployment.md)

Once you have _deployed_ you will will be able
to view/use your app in any Web/Mobile Browser.

e.g: https://phxchat.herokuapp.com <br />
![phxchat](https://user-images.githubusercontent.com/194400/36480000-9c6fe768-1702-11e8-86d6-c8703883096c.png)

<br />


![thats-all-folks](https://user-images.githubusercontent.com/194400/36492991-6bc5dd42-1726-11e8-9d7b-a11c44d786a0.jpg)

<br />

## What _Next_?

If you found this example useful, please ⭐️ the GitHub repository
so we (_and others_) know you liked it!

If you want to learn more Phoenix and the magic of **`LiveView`**,
consider reading our beginner's tutorial:
[github.com/dwyl/**phoenix-liveview-counter-tutorial**](https://github.com/dwyl/phoenix-liveview-counter-tutorial)

For a version of a chat application using **LiveView** you can read the following repository:
[github.com/dwyl/**phoenix-liveview-chat-example**](https://github.com/dwyl/phoenix-liveview-chat-example)

Thank you for learning with us! ☀️


<br /> <br />


## Inspiration

This repo is inspired by @chrismccord's Simple Chat Example:
https://github.com/chrismccord/phoenix_chat_example ❤️

At the time of writing Chris' example was last updated on
[20 Feb 2018](https://github.com/chrismccord/phoenix_chat_example/commit/7fb1d3d040b9d1e9a1bbd239c60ca1f4dd403c24)
and uses
[Phoenix 1.3](https://github.com/chrismccord/phoenix_chat_example/blob/7fb1d3d040b9d1e9a1bbd239c60ca1f4dd403c24/mix.exs#L25)
see:
[issues/40](https://github.com/chrismccord/phoenix_chat_example/issues/40). <br />
There are quite a few differences (breaking changes)
between Phoenix 1.3 and 1.6 (_the latest version_). <br />

Our tutorial uses Phoenix `1.6.2` (latest as of October 2021).
Our hope is that by writing (_and maintaining_)
a step-by-step beginner focussed
tutorial we contribute to the Elixir/Phoenix community
without piling up
[PRs](https://github.com/chrismccord/phoenix_chat_example/pulls)
on Chris's repo.


## Recommended Reading / Learning

+ ExUnit docs: https://hexdocs.pm/ex_unit/ExUnit.html
+ Testing Phoenix Channels:
https://quickleft.com/blog/testing-phoenix-websockets
+ Phoenix WebSockets Under a Microscope:
https://zorbash.com/post/phoenix-websockets-under-a-microscope

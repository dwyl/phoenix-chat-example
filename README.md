# Phoenix Chat Example

![phoenix-chat-logo](https://user-images.githubusercontent.com/194400/39481553-c448aa1c-4d63-11e8-9389-47789833a96e.png)


[![Build Status](https://img.shields.io/travis/dwyl/phoenix-chat-example/master.svg?style=flat-square)](https://travis-ci.org/dwyl/phoenix-chat-example)
[![codecov.io](https://img.shields.io/codecov/c/github/dwyl/phoenix-chat-example/master.svg?style=flat-square)](http://codecov.io/github/dwyl/phoenix-chat-example?branch=master)
[![HitCount](http://hits.dwyl.io/dwyl/phoenix-chat-example.svg)](https://github.com/dwyl/phoenix-chat-example)
Try it: https://phxchat.herokuapp.com
<!-- [![Deps Status](https://beta.hexfaktor.org/badge/all/github/dwyl/phoenix-chat-example.svg?style=flat-square)](https://beta.hexfaktor.org/github/dwyl/phoenix-chat-example) -->
<!-- [![Inline docs](http://inch-ci.org/github/dwyl/phoenix-chat-example.svg?style=flat-square)](http://inch-ci.org/github/dwyl/phoenix-chat-example) -->


A ***step-by-step tutorial*** for building, testing
and _deploying_ a Chat app in Phoenix!

<!-- Table of Contents Here...?
see: https://github.com/nelsonic/phoenix-chat-example/issues/1 -->


## Why?

Chat apps are the "Hello World" of "real time" example apps. <br />

_Most_ example apps show a few basics and then _ignore_ "_the rest_" ... <br />
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
but if think we "_skipped a step_"
or  you feel "_stuck_" for any reason,
or have _any_ questions (_related to this example_),
please open an issue on GitHub! <br />
Both the @dwyl and Phoenix communities are _super **beginner-friendly**_,
so don't be afraid/shy. <br />
Also, by asking questions, you are helping everyone
that is or might be stuck with the _same_ thing!
+ **Chat App _specific_** questions:
https://github.com/nelsonic/phoenix-chat-example
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

2. **Phoenix** framework **installed**.
  see: https://hexdocs.pm/phoenix/installation.html <br />
  e.g: <br />
```
mix archive.install hex phx_new 1.4.0
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
Erlang/OTP 21 [erts-10.1.1] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [hipe] [dtrace]

Elixir 1.7.4 (compiled with Erlang/OTP 21)
```

Check you have the **latest** version of **Phoenix**:
```sh
mix phx.new -v
```
You should see:
```sh
Phoenix v1.4.0
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

## 1. _Create_ The _App_

In your terminal program on your localhost,
type the following command to create the app:

```sh
mix phx.new chat
```
That will create the directory structure and project files. <br />


When asked to "***Fetch and install dependencies***? [Yn]",<br />
Type `y` (_the "Y" key_) in your terminal,
followed by the `[Enter]` / `[Return]` key.

You should see: <br />
![fetch-and-install-dependencies](https://user-images.githubusercontent.com/194400/34833220-d219221c-f6e6-11e7-88d6-87aa4c3054e4.png)

Change directory into the `chat` directory by running the suggested command:
```sh
cd chat
```

> _**Note**: at this point there is already an "App"
it just does not **do** anything (yet) ... <br />
you **can** run `mix phx.server`
in your terminal <br />
and open [http://localhost:4000](http://localhost:4000)
in your browser <br />
and you will see is the `default`
"Welcome to Phoenix" homepage:_ <br />
![welcome-to-phoenix](https://user-images.githubusercontent.com/194400/36354251-65e095c0-14c9-11e8-98e4-9d91c98c9b8e.png)

Let's continue to the _interesting_ part!

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


## 3. Update the Template File (UI)

Open the the
[`/lib/chat_web/templates/page/index.html.eex`](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/lib/chat_web/templates/page/index.html.eex)
file <br />
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

This is the _basic_ form we will use to input Chat messages. <br />
The classes e.g: `"form-control"` and `"col-xs-3"`
are Bootstrap CSS classes to _style_ the form. <br />
Phoenix includes Bootstrap by default so you can get up-and-running
with your App/Idea/"MVP"! <br />
If you are unfamiliar with Bootstrap UI,
read: https://getbootstrap.com/docs/3.3 <br />
and if you _specifically_ want to understand the Bootstrap _forms_,
see: https://getbootstrap.com/docs/3.3/css/#forms

Your `index.html.eex` template file should look like this:
[`/lib/chat_web/templates/page/index.html.eex`](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/lib/chat_web/templates/page/index.html.eex) (_snapshot_)


## 4. Update the "Client" code in App.js

Open:
[`/assets/js/app.js`](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/assets/js/app.js#L21-L48)
and uncomment the line:
```js
import socket from "./socket"
```
with the line _uncommented_ our app will import the `socket.js` file
which will give us WebSocket functionality.

Then add the following JavaScript ("Client") code:

```js
var channel = socket.channel('room:lobby', {}); // connect to chat "room"

channel.on('shout', function (payload) { // listen to the 'shout' event
  var li = document.createElement("li"); // creaet new list item DOM element
  var name = payload.name || 'guest';    // get name from payload or set default
  li.innerHTML = '<b>' + name + '</b>: ' + payload.message; // set li contents
  ul.appendChild(li);                    // append to list
});

channel.join(); // join the channel.


var ul = document.getElementById('msg-list');        // list of messages.
var name = document.getElementById('name');          // name of message sender
var msg = document.getElementById('msg');            // message input field

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    channel.push('shout', { // send the message to the server on "shout" channel
      name: name.value,     // get value of "name" of person sending the message
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
[`/assets/js/app.js`](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/assets/js/app.js#L21-L48)



## 5. Instal the Node.js Dependencies

In order to use JS in your Phoenix project,
you need to install the node.js dependencies:
```sh
cd assets && npm install && cd ..
```
That might take a few seconds (_depending on your internet connection speed_)

But once it completes you should see:
```sh
added 1022 packages from 600 contributors and audited 14893 packages in 32.079s
found 0 vulnerabilities
```


# Storing Chat Message Data/History

If we didn't _want_ to _save_ the chat history,
we could just _deploy_ this App _immediately_
and we'd be done! <br />

<!--
> In fact, it could be a "_use-case_" / "_feature_"
to have "_ephemeral_" chat without _any_ history ...
> see: http://www.psstchat.com/
![psst-chat](https://user-images.githubusercontent.com/194400/35284714-6e338596-0053-11e8-998a-83b917ec90ae.png)
> but we are _assuming_ that _most_ chat apps save history
> so that `new` people joining the "channel" can see the history
> and people who are briefly "absent" can "catch up" on the history.
-->

## 6. Create/Configure Database

Create the database to store the chat history data:

```sh
mix ecto.create
```
You should see:
```sh
The database for Chat.Repo has been created
```

## 7. Generate Database Schema to Store Chat History

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

Additionally a migration file is created, e.g:
`creating priv/repo/migrations/20180107074333_create_messages.exs`
The "_migration_" actually _creates_ the database table in our database.



## 8. Run the Ecto Migration (_Create The Database Table_)

In your terminal run the following command to create the `messages` table:

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

### 8.1 Review the Messages Table Schema

If you open your PostgreSQL GUI (_e.g: [pgadmin](https://www.pgadmin.org)_)
you will see that the messages table has been created
in the `chat_dev` database:

![pgadmin-messages-table](https://user-images.githubusercontent.com/194400/35624169-deaa7fd4-0696-11e8-8dd0-584eba3a2037.png)

You can view the table schema by "_right-clicking_" (_`ctrl + click` on Mac_)
on the `messages` table and selecting "properties":

![pgadmin-messages-schema-columns-view](https://user-images.githubusercontent.com/194400/35623295-c3a4df5c-0693-11e8-8484-199c2bcab458.png)



## 9. Insert Messages into Database

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

## 10. Load _Existing_ Messages (_When Someone Joins the Chat_)

Open the `lib/chat/message.ex` file and add a new function to it:
```elixir
def get_messages(limit \\ 20) do
  Chat.Repo.all(Chat.Message, limit: limit)
end
```
This function accepts a single parameter `limit` to only return a fixed/maximum
number of records.
It uses Ecto's `all` function to fetch all records from the database.
`Message` is the name of the schema/table we want to get records for,
and limit is the maximum number of records to fetch.


## 11. Send Existing Messages to the Client when they Join

In the `/lib/chat_web/channels/room_channel.ex` file create a new function:
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

## 12. _Checkpoint_: Our Chat App Saves Messages!! (_Try it_!)

Start the Phoenix server (_if it is not already running_):
```sh
mix phx.server
```

> _**Note**: it will take a few seconds to **compile** but then you should see:_

![server-running](https://user-images.githubusercontent.com/194400/35188430-22de4d9c-fe2d-11e7-82d3-85e0a0482e17.png)

The line:
```sh
[info] Running ChatWeb.Endpoint with Cowboy using http://0.0.0.0:4000
```
tells us that our code compiled (_as expected_) and the Chat App
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

## 13. Run the Default/Generated Tests

Whenever you create a new Phoenix app
or add a new feature (_like a channel_),
Phoenix _generates_ a new test for you.

We _run_ the tests using the **`mix test`** command:

![one-failing-test](https://user-images.githubusercontent.com/194400/35329453-d2549d86-00f7-11e8-9176-2cd14a258abe.png)

In this case _one_ of the tests fails. (_7 tests, **1 failure**_)

The "**stacktrace**" informs us that location of the failing test is:
`test/chat_web/controllers/page_controller_test.exs:4`
And that the "assertion" is:
```elixir
assert html_response(conn, 200) =~ "Welcome to Phoenix!"
```
In _English_ this means we are asserting that the "homepage"
returns an "HTML response" which contains the words: "**Welcome to Phoenix!**"

Since we changed the code in
[`/lib/chat_web/templates/page/index.html.eex`](https://github.com/nelsonic/phoenix-chat-example/blob/fb02977db7a0e749a6eb5212749ae4df190f6b01/lib/chat_web/templates/page/index.html.eex)
(_in section 3, above_),
the page no longer contains the string " ***Welcome to Phoenix!*** ".

### 13.1 Fix The Failing Test

We have _two_ options:
1. **Add** the text "**Welcome to Phoenix!**" back into `page/index.html.eex`
2. ***Update*** the assertion to something that _is_ on the page e.g:
"**msg-list**".

Both are _valid_ approaches, however we _prefer_ the second option because
it "_reflects the reality_" rather than "_altering reality_"
to match the exiting assertion. <br />
Let's make the update now. Open the
[`test/chat_web/controllers/page_controller_test.exs`](https://github.com/nelsonic/phoenix-chat-example/blob/f9cf59e8282a5c0756d7c6be91f3b5926430fd3b/test/chat_web/controllers/page_controller_test.exs)
file and change line **6** to:

```elixir
assert html_response(conn, 200) =~ "msg-list"
```
We know that `"msg-list"` is _on_ the page
because that's the `id` of the `<ul>`
where our message history is bing displayed.

Your `page_controller_test.exs` file should now look like this:
[`/test/chat_web/controllers/page_controller_test.exs#L6`](https://github.com/nelsonic/phoenix-chat-example/blob/c2abfa05df178f71f615eae363b7475788c96b43/test/chat_web/controllers/page_controller_test.exs#L6)

### 13.2 Re-Run The Test(s)

Now that we have _updated_ the assertion,
we can re-run the tests with the **`mix test`** command:

![tests-pass](https://user-images.githubusercontent.com/194400/35342629-6dcc7c3e-0120-11e8-89dc-5f07e81b32ff.png)

## 14. Understanding The Channel Tests

It's worth taking a moment (_or as long as you need_!)
to _understand_ what is going on in the
[`/room_channel_test.exs`](https://github.com/nelsonic/phoenix-chat-example/blob/master/test/chat_web/channels/room_channel_test.exs)
file. _Open_ it if you have not already, read the test descriptions & code.

> For a bit of _context_ we recommend reading:
[https://hexdocs.pm/phoenix/**testing_channels**.html](https://hexdocs.pm/phoenix/testing_channels.html)

### 14.1 _Analyse_ a Test

Let's take a look at the _first_ test in
[/test/chat_web/channels/room_channel_test.exs#L14-L17](https://github.com/nelsonic/phoenix-chat-example/blob/f3823e64d9f9826db67f5cdf228ea5c974ad59fa/test/chat_web/channels/room_channel_test.exs#L14-L17):

```elixir
test "ping replies with status ok", %{socket: socket} do
  ref = push socket, "ping", %{"hello" => "there"}
  assert_reply ref, :ok, %{"hello" => "there"}
end
```
The test get's the `socket` from the `setup` function (_on line 6 of the file_)
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

## 15. What is _Not_ Tested?

_Often_ we can learn a _lot_ about an application (_or API_)
from reading the tests and seeing where the "gaps" in testing are.

_Thankfully_ we can achieve this with only a couple of steps:

### 15.1 Add `excoveralls` as a (Development) Dependency to `mix.exs`

Open your `mix.exs` file and find the "deps" function:
```elixir
defp deps do
```

Add the following line to the end of the List:
```elixir
{:excoveralls, "~> 0.7.0", only: [:test, :dev]}, # tracking test coverage
```
Additionally, find the `def project do` section (_towards the top of `mix.exs`_)
and add the following lines to the List:
```elixir
test_coverage: [tool: ExCoveralls],
preferred_cli_env: ["coveralls": :test, "coveralls.detail": :test,
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

### 15.2 Create a _New File_ Called `coveralls.json`

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


### 15.3 Run the Tests with Coverage Checking

To run the tests with coverage, copy-paste the following command
into your terminal:

```elixir
MIX_ENV=test mix do coveralls.json
```
You should see: <br />
![phoenix-chat-coverage](https://user-images.githubusercontent.com/194400/36356461-435c4dde-14ea-11e8-9e48-3ea49f55b1e7.png)

As we can se here, only **59.3%** of lines of code in `/lib`
are being "covered" by the tests we have written.

To **view** the coverage in a web browser run the following:

```elixir
MIX_ENV=test mix coveralls.html && open cover/excoveralls.html
```
<br />
This will open the Coverage Report (HTML) in your default Web Browser: <br />

![coverage-report-59 3-percent](https://user-images.githubusercontent.com/194400/36425359-7637adfc-163e-11e8-9c9f-3c4fcbcded32.png)


> <small>_**Note**: you will need to **temporarily** lower
the coverage threshold in `coveralls.json` form `100` to `50`
for this command to work because it's expecting 100% coverage._</small>



<!-- I think I'm at a point where I need to take a "Detour"
to write up my **Definitive** thoughts on "Test Coverage" once-and-for-all! -->




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
  - 1.6
addons: # ensure that Travis-CI provisions a DB for our test:
  postgresql: '9.5'
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

_Want **more**_? ***Ask***!
_Please share your thoughts on GitHub_: https://github.com/dwyl/phoenix-chat-example/issues


<br /> <br />


## Inspiration

This repo is inspired by @chrismccord's Simple Chat Example:
https://github.com/chrismccord/phoenix_chat_example

At the time of writing Chris' example is still
[Phoenix 1.2](https://github.com/chrismccord/phoenix_chat_example/blob/31f0c5f80a04af0a05fdec89d5b428880c4ea814/mix.exs#L25)
see: https://github.com/chrismccord/phoenix_chat_example/issues/40
therefore we decided to write a quick version for Phoenix 1.4 :-)


## Recommended Reading / Learning

+ ExUnit docs: https://hexdocs.pm/ex_unit/ExUnit.html
+ Testing Phoenix Channels:
https://quickleft.com/blog/testing-phoenix-websockets
+ Phoenix WebSockets Under a Microscope:
https://zorbash.com/post/phoenix-websockets-under-a-microscope

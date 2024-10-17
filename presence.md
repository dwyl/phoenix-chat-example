<div align="center">

# Adding `Presence` in 10 Minutes! 👥

</div>

Most chat apps have a feature 
where you can check who is currently online.
We can use [`Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
to track processes 
that are connected to our public channel room.

By using Presence,
we can show *which processes*
are actively connected to the channel
and show it to the person!

It isn't as difficult as you may think.
Let's do it! 🏃‍♂️


- [Adding `Presence` in 10 Minutes! 👥](#adding-presence-in-10-minutes-)
  - [1. Setting up `Presence`](#1-setting-up-presence)
  - [2. Tracking people in `room_channel.ex`](#2-tracking-people-in-room_channelex)
  - [3. Changing the UI](#3-changing-the-ui)
    - [3.1 Change HTML in view file](#31-change-html-in-view-file)
    - [3.2 Adding/removing people to online people list](#32-addingremoving-people-to-online-people-list)
    - [3.3 Fixing scrolling](#33-fixing-scrolling)
  - [4. Fixing test](#4-fixing-test)
  - [5. Give it a whirl! 🎉](#5-give-it-a-whirl-)


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
and **after the `PubSub` child**.

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


## 2. Tracking people in `room_channel.ex`

We are ready to track people 
in `room_channel.ex`!

We have to note that
*not all people are authenticated*.
Ideally, we would begin tracking people/processes
whenever they join the channel.
However, 
when people are not using authentication
(via Github or Google, for example),
**we don't know their names until they send a message**.

Additionally,
a person using the app
can have different names throughout
their visit.
So different names must be properly
removed or added according to the processes
that are associated to it.

By allowing people to have multiple names,
there might be some cases where two different people
can have the same name.
Therefore, we need to properly 
*remove one name pertaining to one process*
*whenever it leaves the room*,
**while maintaining the other same name for the other process in the online people list**.

Let's start implementing `Presence` into our application
so it satisfies these needs!

In `lib/chat_web/channels/room_channel.ex`, 
let's import `Presence` 
and start tracking processes.

```elixir
alias ChatWeb.Presence
```

Change the `handle_info(:after_join, socket)` function
so it looks like the following.

```elixir
def handle_info(:after_join, socket) do
    # Get messages and list them
    Chat.Message.get_messages()
    |> Enum.reverse()     # reverts the enum to display the latest message at the bottom of the page
    |> Enum.each(fn msg ->
      push(socket, "shout", %{
        name: msg.name,
      })
    end)

    # Send currently online people in lobby
    push(socket, "presence_state", Presence.list("room:lobby"))

    {:noreply, socket}
  end
```

We have added the `push/3` function
that the current presence information for the socket's topic 
is pushed to the client as a `"presence_state"` event.

Next, 
in `handle_in("shout", payload, socket)`,
change it like so:

```elixir
  def handle_in("shout", payload, socket) do
    # Insert message in database
    {:ok, msg} = Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert()

    # Assigning name to socket assigns and tracking presence
    socket
      |> assign(:person_name, msg.name)
      |> track_presence()
      |> broadcast("shout", Map.put_new(payload, :id, msg.id))

    {:noreply, socket}
  end

  defp track_presence(%{assigns: %{person_name: person_name}} = socket) do
    Presence.track(socket, person_name, %{
      online_at: inspect(System.system_time(:second))
    })

    socket
  end
```

Every time the person sends a message
(sends a `"shout"` event),
the `:person_name` if assigned to the socket assigns,
the process *is tracked using `Presence`*
(by calling `do_track`, 
which uses the 
[`Presence.track/3`](https://hexdocs.pm/phoenix/Phoenix.Presence.html#c:track/3)
function)
and broadcasts the event to other people.

e.g.
[`lib/chat_web/channels/room_channel.ex`](https://github.com/dwyl/phoenix-chat-example/blob/add_presence-%2314/lib/chat_web/channels/room_channel.ex)


## 3. Changing the UI

Now that we are tracking each process,
we are now ready to *show* to each person
**who is online**!


### 3.1 Change HTML in view file

Let's first add a space in our page
dedicated to show the list of online people.
We want to make our page 
[**responsive**](https://web.dev/learn/design/),
meaning we want our page to be properly resized
according to any viewport dimension,
be it a mobile device or desktop.

Open 
`lib/chat_web/controllers/page_html/home.html.heex` 
and change it.

```html

<!-- Shown only on mobile devices -->
<div class="mt-[5rem] p-4 ml-4 mr-4 mb-4 border-2 radius rounded-md lg:hidden">
  <div class="flex justify-start flex-col overflow-hidden whitespace-nowrap">
    <h5 class="text-md leading-tight font-medium mb-2 text-green-700">people online</h5>
    <ul id="people_online-list-mobile" phx-update="append" class="pa-1"></ul>
  </div>
</div>

<div id="chat-container" class="max-h-screen flex flex-col lg:flex-row lg:min-h-screen ">
  <div class="flex flex-col lg:flex-grow">
    <!-- The list of messages will appear here: -->
    <ul id="msg-list" phx-update="append" class="pa-1 lg:mt-[4rem] overflow-y-auto"></ul>

    <footer class="bg-slate-800 p-2 h-[3rem] bottom-0 w-full flex justify-center sticky mt-[auto]">
      <div class="w-full flex flex-row items-center text-gray-700 focus:outline-none font-normal">
        <%= if @loggedin do %>
          <input
            type="text"
            disabled
            class="hidden"
            id="name"
            placeholder={person_name(@person)}
            value={person_name(@person)}
          />
        <% else %>
          <input
            type="text"
            id="name"
            placeholder="Name"
            required
            class="grow-0 w-1/6 px-1.5 py-1.5"
          />
        <% end %>

        <input
          type="text"
          id="msg"
          placeholder="Your message"
          required
          class="grow w-2/3 mx-1 px-2 py-1.5"
        />

        <button
          id="send"
          class="text-white bold rounded px-3 py-1.5 w-fit
            transition-colors duration-150 bg-sky-500 hover:bg-sky-600"
        >
          Send
        </button>
      </div>
    </footer>
  </div>
  <!-- Online people will only be shown here on desktop devices -->
  <div class="hidden lg:flex">
    <div class="mt-[5rem] p-4 ml-4 mr-4 mb-4 border-2 radius rounded-md max-w-[20vw]">
      <div class="flex justify-start flex-col overflow-hidden whitespace-nowrap">
        <h5 class="text-md leading-tight font-medium mb-2 text-green-700">people online</h5>
        <ul id="people_online-list-desktop" phx-update="append" class="pa-1"></ul>
      </div>
    </div>
  </div>
</div>
```

We have made some changed to the layout of the image
so it works better on both mobile and desktop devices.

What's important is 
that **we've added two `<ul>` elements with `id` `people_online-list`**,
one for both mobile and another for desktop.
We've done it like this because this list needs to be in
different places depending on the device.
We've achieved this by *hiding* one list on mobile devices
and showing it on desktops,
and vice-versa.

This is why we have two lists:
- one for mobile, 
with `id` `"people_online-list-mobile"`.
- one for desktop, 
with `id` `"people_online-list-desktop"`.

The names of the online people
will be appended to both lists dynamically.

Your page should now look like this
on your desktop.

<img width="1200" alt="desktop" src="https://user-images.githubusercontent.com/17494745/218724815-67a2d8c4-7ce1-41cd-adee-7e48b1d6cae5.png">

In a mobile device, 
the list gets "pushed" to the top of the page.

<img width="800" alt="mobile" src="https://user-images.githubusercontent.com/17494745/218725316-68bba28e-8230-4e67-9e81-4b467709d5f6.png">


### 3.2 Adding/removing people to online people list

The only thing that's left 
is *populating the list*
with `<li>` elements (online people) inside the `<ul>` list.

We are going to make these changes
in `assets/js/app.js`.
Add these functions to the file.

```js
const peopleListMobile = document.getElementById('people_online-list-mobile');      // online people list mobile
const peopleListDesktop = document.getElementById('people_online-list-desktop');      // online people list desktop

// This function will be probably caught when the person first enters the page
channel.on('presence_state', function (payload) {
  // Array of objects with id and name
  const currentlyOnlinePeople = Object.entries(payload).map(elem => ({name: elem[0], id: elem[1].metas[0].phx_ref}))
    
  updateOnlinePeopleList(currentlyOnlinePeople)
})

// Listening to presence events whenever a person leaves or joins
channel.on('presence_diff', function (payload) {
  if(payload.joins && payload.leaves) {
    // Array of objects with id and name
    const currentlyOnlinePeople = Object.entries(payload.joins).map(elem => ({name: elem[0], id: elem[1].metas[0].phx_ref}))
    const peopleThatLeft = Object.entries(payload.leaves).map(elem => ({name: elem[0], id: elem[1].metas[0].phx_ref}))

    updateOnlinePeopleList(currentlyOnlinePeople)
    removePeopleThatLeft(peopleThatLeft)
  }
});

function updateOnlinePeopleList(currentlyOnlinePeople) {
    // Add joined people
    for (var i = currentlyOnlinePeople.length - 1; i >= 0; i--) {
      const name = currentlyOnlinePeople[i].name
      const id = name + "-" + currentlyOnlinePeople[i].id
  
      if (document.getElementById(name) == null) {
        var liMobile = document.createElement("li"); // create new person list item DOM element for mobile
        var liDesktop = document.createElement("li"); // create new person list item DOM element for desktop
        
        liMobile.id = id + '_mobile'
        liDesktop.id = id + '_desktop'
        liMobile.innerHTML = `<caption>${sanitizeString(name)}</caption>`
        liDesktop.innerHTML = `<caption>${sanitizeString(name)}</caption>`

        peopleListMobile.appendChild(liMobile);                    // append to  peoplelist
        peopleListDesktop.appendChild(liDesktop);                    // append to  peoplelist
      }
    }
}

function removePeopleThatLeft(peopleThatLeft) {
  // Remove people that left
  for (var i = peopleThatLeft.length - 1; i >= 0; i--) {
    const name = peopleThatLeft[i].name
    const id = name + "-" + peopleThatLeft[i].id

    const personThatLeftMobile = document.getElementById(id + '_mobile')
    const personThatLeftDesktop = document.getElementById(id +  '_desktop')

    if (personThatLeftMobile != null && personThatLeftDesktop != null) {
      peopleListMobile.removeChild(personThatLeftMobile);         // remove the person from list mobile
      peopleListDesktop.removeChild(personThatLeftDesktop);        // remove the person from list desktop
    }
  }
}

function sanitizeString(str){
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
  return str.trim();
}
```

e.g.
[`assets/js/app.js`](https://github.com/dwyl/phoenix-chat-example/blob/add_presence-%2314/assets/js/app.js)

That's a lot!
To understand the code,
we need to understand
what `presence_state` and `presence_diff` are.
These are 
[documented in the `Presence` docs](https://hexdocs.pm/phoenix/Phoenix.Presence.html),
but making long story short, 
they are objects that are sent to the client
with information about the processes within the channel.
- `presence_state` is pushed whenever the person joins the channel,
which is useful to see who already is online in the channel
on the get-go.
It has a structure like:

```json
{
    "name": {
        "metas": [
            {
                "online_at": "1676345588",
                "phx_ref": "F0OTbkPqt3DqDALG"
            }
        ]
    }
}
```

- `presence_diff` is sent to the client 
whenever a person joins or leaves the channel.
It's a diff structure, a map of `:joins` and `:leaves`.

```elixir
%{
  joins: %{"123" => %{metas: [%{status: "away", phx_ref: ...}]}},
  leaves: %{"456" => %{metas: [%{status: "online", phx_ref: ...}]}}
}
```

With the information of both of these objects,
we can construct our online person list!

We use metadata like `phx_ref` 
[(which uniquely identifies the metadata for a given key)](https://hexdocs.pm/phoenix/Phoenix.Presence.html#c:list/1)
and the name of the person
**to act as an `id` of the element to be added to the list**.
This way, 
whenever a person leaves, 
we remove the element from the list 
by this `id`.

Do notice we are adding these elements,
technically, *two lists*,
one that is shown on mobile devices 
and another that is shown on desktops.


### 3.3 Fixing scrolling

When a person sends a message,
the browser should scroll down.

This behaviour already existed.
But now that we've changes the UI, 
scrolling no longer works.
This is because scrolling
*is now done on the list of messages element in mobile devices*.

To fix this, 
we just need to add a last line 
in `sendMessage`
in `assets/js/app.js`.


```js
function sendMessage() {

  channel.push('shout', {
    name: name.value || "guest",
    message: msg.value,
    inserted_at: new Date()
  });

  msg.value = '';
  window.scrollTo(0, document.documentElement.scrollHeight) // scroll to the end of the page on send for desktop
  ul.scrollTo(0, ul.scrollHeight)                           // scroll to the end of the page on send for mobile (THIS IS THE NEW LINE)
}
```

## 4. Fixing test

If you run `mix test`,
you will notice one test is broken.
More specifically in
`test/chat_web/channels/room_channel_test.exs`.

We can quickly fix it!
Locate the `shout broadcasts to room:lobby` test,
and change it.

```elixir
  test "shout broadcasts to room:lobby a message with name", %{socket: socket} do
    push(socket, "shout", %{"name" => "test_name", "message" => "hey all"})
    assert_broadcast "shout", %{"name" => "test_name", "message" => "hey all"}
  end
```

If you run `mix test`,
all tests should pass!

```elixir
............
Finished in 0.7 seconds (0.6s async, 0.05s sync)
12 tests, 0 failures
```


## 5. Give it a whirl! 🎉

We should all be done!
If you run the app
(`mix phx.server`)
in two different windows,
you will notice that the list of online people 
will be shown!

This also works for *authenticated people*.

Check the gif below for a quick demo!

![final_demo](https://user-images.githubusercontent.com/17494745/218738594-b1b8f853-f9cd-4bed-a301-ea68479386f0.gif)

Notice how the anonymonus person
goes under two different names.
Both disappear when he leaves!


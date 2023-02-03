<div align="center">

# Auth in 5 Minutes! 🔐

</div>

Adding protected routes and authentication 
to a `Phoenix` App can have quite a few steps ... ⏳ <br />
Luckily, there is a package 
(we built; yes, shameless plug =])
that can **_significantly_ simplify** the process!

In this guide we'll show the steps 
for adding **auth** using 
[**`auth_plug`**](https://github.com/dwyl/auth_plug)
in **5 minutes**. <br />
We'll add **_optional_ `auth`**
that will let people authenticate 
with their **`GitHub`** or **`Google`** Account
and use their Account username and Avatar in the Chat. 

Let's do this!

- [Auth in 5 Minutes! 🔐](#auth-in-5-minutes-)
  - [1. Add `auth_plug` to `mix.exs`](#1-add-auth_plug-to-mixexs)
  - [2. Create `AUTH_API_KEY`](#2-create-auth_api_key)
  - [3. Create the _Optional_ Auth Pipeline in `router.ex`](#3-create-the-optional-auth-pipeline-in-routerex)
  - [4. Create `AuthController`](#4-create-authcontroller)
  - [5. Create `AuthControllerTest`](#5-create-authcontrollertest)
  - [6. Update the UI Template with `Auth`](#6-update-the-ui-template-with-auth)
  - [7. Execute the `AuthControllerTest`](#7-execute-the-authcontrollertest)
  - [8. Congratulations!](#8-congratulations)

<br />

## 1. Add `auth_plug` to `mix.exs`

[**`auth_plug`**](https://github.com/dwyl/auth_plug)
will serve as 
["***middleware***"](https://en.wikipedia.org/wiki/Middleware)
for handling authentication.

Add **`auth_plug`** to **`deps`** in **`mix.exs`**, e.g:

```elixir
{:auth_plug, "~> 1.5"},
```

then run: 

```elixir
mix deps.get
```

That will install everything you need.


## 2. Create `AUTH_API_KEY`

Visit [authdemo.fly.dev](https://authdemo.fly.dev/apps/new),
sign in with your `GitHub` or `Google` account,
and create your app with `localhost:4000` as the `URL`:

<img width="1089" alt="image" src="https://user-images.githubusercontent.com/194400/202419197-80e082d0-1ab0-497c-a095-6764e6df9b64.png">

When you click "**Save**" 
you will be see a screen 
similar to the following:

<img width="1162" alt="image" src="https://user-images.githubusercontent.com/194400/202419365-e06c43d6-c537-4646-a1a3-90320fb3aa59.png">

> **Note**: don't worry this is **not** a **valid** key,
> it's just for illustration purposes. 

Copy the shown `AUTH_API_KEY` 
and paste in into 
a new `.env` file, 
e.g:

```txt
export AUTH_API_KEY=2cfxNaMmkvwKmHncbYAL58mLZMs/2cfxNa4RnU12gYYSwPvp2hSPFdVDcbdK/authdemo.fly.dev
```

Make sure the `.env` line 
is in your `.gitignore` file.

Then run:

```sh
source .env
```

This will make the `AUTH_API_KEY` environment variable available.

## 3. Create the _Optional_ Auth Pipeline in `router.ex`

Open the `router.ex` file 
and create a new 
[Optional Auth](https://github.com/dwyl/auth_plug#optional-auth)
pipeline and use it in your routes:

```elixir
# define the new pipeline using auth_plug
pipeline :authOptional, do: plug(AuthPlugOptional)

scope "/", AppWeb do
  pipe_through [:browser, :authOptional]

  get "/", PageController, :home
  get "/login", AuthController, :login
  get "/logout", AuthController, :logout
end
```


## 4. Create `AuthController`

Create a new file: 
`lib/chat_web/controllers/auth_controller.ex` 
and add the following code:

```elixir
defmodule ChatWeb.AuthController do
  use ChatWeb, :controller

  def login(conn, _params) do
    redirect(conn, external: AuthPlug.get_auth_url(conn, "/"))
  end

  def logout(conn, _params) do
    conn
    |> AuthPlug.logout()
    |> put_status(302)
    |> redirect(to: "/")
  end
end
```

The `login/2` function redirects to the dwyl auth app. 
Read more about how to use the `AuthPlug.get_auth_url/2` function. 
Once authenticated,
 the user will be redirected to the `/` endpoint
and a `jwt` session is created on the client.

The `logout/2` function invokes `AuthPlug.logout/1`, 
which removes the (JWT) session and redirects back to the homepage.

## 5. Create `AuthControllerTest`

Create a file with the path:
`test/chat_web/controllers/auth_controller_test.exs`

Add the following code to it:

```elixir
defmodule ChatWeb.AuthControllerTest do
  use ChatWeb.ConnCase, async: true

  test "Logout link displayed when loggedin", %{conn: conn} do
    data = %{email: "test@dwyl.com", givenName: "Simon", picture: "this", auth_provider: "GitHub"}
    jwt = AuthPlug.Token.generate_jwt!(data)

    conn = get(conn, "/?jwt=#{jwt}")
    assert html_response(conn, 200) =~ "logout"
  end

  test "get /logout with valid JWT", %{conn: conn} do
    data = %{
      email: "al@dwyl.com",
      givenName: "Al",
      picture: "this",
      auth_provider: "GitHub",
      sid: 1,
      id: 1
    }

    jwt = AuthPlug.Token.generate_jwt!(data)

    conn =
      conn
      |> put_req_header("authorization", jwt)
      |> get("/logout")

    assert "/" = redirected_to(conn, 302)
  end

  test "test login link redirect to authdemo.fly.dev", %{conn: conn} do
    conn = get(conn, "/login")
    assert redirected_to(conn, 302) =~ "authdemo.fly.dev"
  end
end
```
<br />

## 6. Update the UI Template with `Auth`

Now that we've implemented the authentication flow,
we need to show it to the user!

Let's first properly show the username
of the logged in user.
Inside `lib/chat_web/controllers/page_html.ex`,
add the following function.

```elixir
  def person_name(person) do
    person.givenName || person.username || "guest"
  end
```

The HEEX template inside 
`lib/chat_web/controllers/page_html/home.html.heex`
will have access to the functions
inside `lib/chat_web/controllers/page_html.ex`,
as it is managed by it.

`page_html.ex` is the **view**
(that is represented by 
the files inside `page_html/*`),
whereas `page_controller.ex` is the **controller**.

After adding this function,
head over to `lib/chat_web/controllers/page_html/home.html.heex`
and change it to the following.

```elixir
<!-- The list of messages will appear here: -->
<ul id='msg-list' phx-update="append" class="pa-1">
</ul>

<footer class="bg-slate-800 p-2 h-[3rem] fixed bottom-0 w-full flex justify-center">
  <div class="w-full flex flex-row items-center text-gray-700 focus:outline-none font-normal">
    <%= if @loggedin do %>
      <input type="text" disabled class="hidden" id="name"
        placeholder={person_name(@person)} value={person_name(@person)}
      />
    <% else %>
      <input type="text" id="name" placeholder="Name" required
        class="grow-0 w-1/6 px-1.5 py-1.5"/>
    <% end %>

    <input type="text" id="msg" placeholder="Your message" required
      class="grow w-2/3 mx-1 px-2 py-1.5"/>

    <button id="send" class="text-white bold rounded px-3 py-1.5 w-fit
        transition-colors duration-150 bg-sky-500 hover:bg-sky-600">
      Send
    </button>
  </div>
</footer>
```

We are now using the `@loggedin` assigns
that is made accessible by `auth_plug` 
to check if a user is logged in.

We are using this property to
show the logged in username.
If no user is logged in,
we show the field in which he can type the wanted name
to send messages.

Notice how we use `person_name/1` function
we defined in `page_html.ex` 
in this file, 
to show the username as placeholder.

Finally,
we need to change the `<header>`
to show a `"Login"` and `"Logout"` button.

Inside `lib/chat_web/components/layouts/root.html.heex`,
change the `<header>` tag to look like so.

```elixir
    <header class="bg-slate-800 w-full h-[4rem] top-0 fixed flex flex-col justify-center z-10">
      <div class="flex flex-row justify-center items-center">
        <h1 class="w-4/5 md:text-3xl text-center font-mono text-white">
          Phoenix Chat Example
        </h1>
        <div class="float-right mr-3">
          <%= if @loggedin do %>
            <div class="flex flex-row justify-center items-center">
              <img width="42px" src={@person.picture} class="rounded-full"/>
              <.link
                class= "bg-red-600 text-white rounded px-2 py-2 ml-2 mr-1"
                href="/logout"
              >
                Logout
              </.link>
            </div>
          <% else %>
              <.link
                class="bg-green-500 text-white rounded px-3 py-2 w-full font-bold"
                href="/login"
              >
                Login
              </.link>
          <% end %>
        </div>
      </div>
    </header>
```

We are now checking if any user is logged in.

If it is, we show the profile picture
and a `"Logout"` button.
Otherwise, we show a `"Login"` button.
These buttons redirect the user
to the `/logout` and `/login` paths, 
respectively, 
which are handled by `AuthController`
we've just created.

And that's it! 🎉
These are all the UI changes we need to make.

## 7. Execute the `AuthControllerTest`

In your terminal,
run the tests with the following command:

```sh
mix test test/chat_web/controllers/auth_controller_test.exs
```

You should expect to see output similar to the following:

```sh
...
Finished in 0.7 seconds (0.7s async, 0.00s sync)
3 tests, 0 failures

Randomized with seed 713921
```

All tests should pass.

If you run the tests with coverage e.g:

```sh
MIX_ENV=test mix coveralls.html
```

You should see **`100%` Coverage** :

```sh
----------------
COV    FILE                                        LINES RELEVANT   MISSED
100.0% lib/chat.ex                                     9        0        0
100.0% lib/chat/message.ex                            26        4        0
100.0% lib/chat/repo.ex                                5        0        0
100.0% lib/chat_web/channels/room_channel.ex          46       10        0
100.0% lib/chat_web/components/layouts.ex              5        0        0
100.0% lib/chat_web/controllers/auth_controller       14        2        0
100.0% lib/chat_web/controllers/error_html.ex         19        1        0
100.0% lib/chat_web/controllers/error_json.ex         15        1        0
100.0% lib/chat_web/controllers/page_controller        9        1        0
100.0% lib/chat_web/controllers/page_html.ex           9        1        0
100.0% lib/chat_web/endpoint.ex                       49        0        0
100.0% lib/chat_web/router.ex                         32        5        0
[TOTAL] 100.0%
----------------
```

## 8. Congratulations!

Awesome job! 👏

We've just added authentication to our app.
It should look like this.

![auth_demo](https://user-images.githubusercontent.com/17494745/216612794-9064f4a5-2a31-4068-b82d-4d8ad45d6e3c.gif)


[![HitCount](https://hits.dwyl.com/dwyl/phoenix-chat-example-auth.svg)](https://github.com/dwyl/phoenix-chat-example)
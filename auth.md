<div align="center">

# Auth in 5 Minutes! 🔐

</div>

Adding protected routes and authentication 
to a `Phoenix` App can be quite a few steps ... ⏳ <br />
Luckily, there there is a package 
[we built; yes, shameless plug =]
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
  - [6. Execute the `AuthControllerTest`](#6-execute-the-authcontrollertest)
  - [7. Update the UI Template with `Auth`](#7-update-the-ui-template-with-auth)

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

  live "/", MessageLive
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

The login/2 function redirects to the dwyl auth app. Read more about how to use the AuthPlug.get_auth_url/2 function. 
Once authenticated the user will be redirected to the / endpoint and a jwt session is created on the client.

The logout/2 function invokes AuthPlug.logout/1 which removes the (JWT) session and redirects back to the homepage.

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

## 6. Execute the `AuthControllerTest`

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
mix c
```

You should see **`100%` Coverage** :

```sh
----------------
COV    FILE                                        LINES RELEVANT   MISSED
100.0% lib/chat.ex                                     9        0        0
100.0% lib/chat/message.ex                            26        4        0
100.0% lib/chat/repo.ex                                5        0        0
100.0% lib/chat_web/channels/room_channel.ex          47        8        0
100.0% lib/chat_web/controllers/auth_controller       14        2        0
100.0% lib/chat_web/controllers/page_controller        8        2        0
100.0% lib/chat_web/endpoint.ex                       54        0        0
100.0% lib/chat_web/views/error_view.ex               16        1        0
100.0% lib/chat_web/views/layout_view.ex               7        0        0
100.0% lib/chat_web/views/page_view.ex                 7        1        0
[TOTAL] 100.0%
----------------
```

With all that in-place,
we can now update the UI!

## 7. Update the UI Template with `Auth`






[![HitCount](https://hits.dwyl.com/dwyl/phoenix-chat-example-auth.svg)](https://github.com/dwyl/phoenix-chat-example)
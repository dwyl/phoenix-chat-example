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

<br />

## 1. Add `auth_plug` to `mix.exs`

[**`auth_plug`**](https://github.com/dwyl/auth_plug)
will serve as 
["***middleware***"](https://en.wikipedia.org/wiki/Middleware)
for handling authentication.

Add **`auth_plug`** to **`deps`** in **`mix.exs`**, e.g:

```elixir
{:auth_plug, "~> 1.4"},
```

then run: 

```elixir
mix deps.get
```

That will install everything you need.


## 2. Create `AUTH_API_KEY`

Visit [authdemo.fly.dev](https://authdemo.fly.dev/apps/new),
sign in with your `GitHub` account,
and create your app with `localhost:4000` URL:

<img width="1089" alt="image" src="https://user-images.githubusercontent.com/194400/202419197-80e082d0-1ab0-497c-a095-6764e6df9b64.png">

When you click "Save" 
you will be presented with a screen 
similar to the following:

<img width="1162" alt="image" src="https://user-images.githubusercontent.com/194400/202419365-e06c43d6-c537-4646-a1a3-90320fb3aa59.png">

> **Note**: don't worry this is not a valid key,
> it's just for illustration purposes. 

Copy the shown `AUTH_API_KEY` environment variable 
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
  use ChatWeb.ConnCase

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
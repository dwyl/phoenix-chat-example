<div align="center">

# Adding Auth 🔐 in 5 Minutes!

</div>

The process of adding protected routes and authentication 
to a `Phoenix` App can be quite a few steps ...
Luckily there there is a package 
[we built; yes, shameless plug =]
that can **_significantly_ simplify** the process!

In this guide we'll show the steps 
for adding **auth** using 
[**`auth_plug`**](https://github.com/dwyl/auth_plug)
in **5 minutes**.
We'll add **_optional_ `auth`**
that will let people authenticate 
with their **`GitHub`** or **`Google`** Account
and use their Account username and Avatar in the Chat. 

Let's do this!

- [Adding Auth 🔐 in 5 Minutes!](#adding-auth--in-5-minutes)
  - [1. Add `auth_plug` to `mix.exs`](#1-add-auth_plug-to-mixexs)
  - [2. Create `AUTH_API_KEY`](#2-create-auth_api_key)
  - [3. Create the _Optional_ Auth Pipeline in `router.ex`](#3-create-the-optional-auth-pipeline-in-routerex)
  - [4. Making index route with login page.](#4-making-index-route-with-login-page)

<br />

## 1. Add `auth_plug` to `mix.exs`

[**`auth_plug`**](https://github.com/dwyl/auth_plug)
will serve as 
["***middleware***"](https://en.wikipedia.org/wiki/Middleware)
for handling authentication.

Add **`auth_plug`** to **`deps`** in **`mix.exs`**, e.g:

```elixir
{:auth_plug, "~> 1.4.20"},
```

then run: 

```sh
mix deps.get
```

That will install everything you need.


## 2. Create `AUTH_API_KEY`

Visit [authdemo.fly.dev](https://authdemo.fly.dev/apps/new),
sign in with your `GitHub` account,
and create your app with `localhost:4000` URL.

Save the shown `AUTH_API_KEY` environment variable 
in an `.env` file, 
e.g:

```txt
export AUTH_API_KEY=2cfxNaMmkvwKmHncbYAL58mLZMs/2cfxNa4RnU12gYYSwPvp2hSPFdVDcbdK/authdemo.fly.dev
```

Make sure the `.env` line is in your `.gitignore` file.
Then run:

```sh
source .env
```

This will make the `AUTH_API_KEY` environment variable available.

## 3. Create the _Optional_ Auth Pipeline in `router.ex`

Add `auth_plug` to your `router.ex` file 
by creating a new 
[Optional Auth](https://github.com/dwyl/auth_plug#optional-auth)
pipeline 
and adding it to run through your protected route.

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


## 4. Making index route with login page.

It's a bit useless having a protected router path that does nothing but just...be protected. Instead, we should
add these auth capabilities to our main page and let the user *have the option* to login with Github or Google Drive
and use their username in following interactions!

//TODO continue after auth_plug is importable


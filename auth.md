<div align="center">

# Adding Auth 🔐 in 5 Minutes!

</div>

The process of adding protected routes and authentication 
to a `Phoenix` App can be quite a few steps ...
Luckily there there is a tool [shameless plug]
that can dramatically simplify the process!

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
  - [1. Add `auth_plug`](#1-add-auth_plug)
  - [2. Making index route with login page.](#2-making-index-route-with-login-page)

<br />

## 1. Add `auth_plug`

We are using 
[**`auth_plug`**](https://github.com/dwyl/auth_plug)
which will serve as 
["***middleware***"](https://en.wikipedia.org/wiki/Middleware)
for handling our all authentication in the Chat App.

Here's a quick rundown 
of the steps.

1. Add `auth_plug` to `deps` in `mix.exs` and run `$ mix deps.get`.
2. Visit [auth.dwyl.com](https://auth.dwyl.com/) and sign in with GitHub and create your app with `localhost:4000` url 
(or whatever port you're running your Phoenix app)
3. Save the shown `AUTH_API_KEY` env variable or make sure you run the application with the `export` command with this env variable.
4. Add `auth_plug` to your `router.ex` file by creating a new pipeline and adding it to run through your protected route.

```elixir
  pipeline :auth, do: plug(AuthPlug)

  scope "/", AppWeb do
    pipe_through :browser
    pipe_through :auth
    get "/admin", PageController, :admin
  end
```
5 - You're done! Your portected route now redirects you to a page where you sign in with whatever option you want.

## 2. Making index route with login page.
It's a bit useless having a protected router path that does nothing but just...be protected. Instead, we should
add these auth capabilities to our main page and let the user *have the option* to login with Github or Google Drive
and use their username in following interactions!

//TODO continue after auth_plug is importable


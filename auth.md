# Adding authentication to Phoenix Chat Example

The process of adding protected routes and authentication to a Phoenix authentication can be annoying sometimes but luckily there are tools out there that can help us get through this. 

In this document we'll document the process of adding authentication to the Phoenix Chat App example.
We'll add a new route that is protected and also use authentication to use as username in the chat app.

Let's do this!

## 1 - Add `auth_plug` to the project.
We are going to use [`auth_plug`](https://github.com/dwyl/auth_plug)
which will serve as middleware in the router. 
Here's a quick rundown of the instructions that can also be found in the link.

1 - Add `auth_plug` to list dependencies in `mix.exs` and run `$ mix deps.get`.
2 - Go to https://auth.dwyl.com/  and sign in with GitHub and create your app with `localhost:4000` url 
(or whatever port you're running your Phoenix app)
3 - Save the shown `AUTH_API_KEY` env variable or make sure you run the application with the `export` command with this env variable.
4 - Add `auth_plug` to your `router.ex` file by creating a new pipeline and adding it to run through your protected route.

```elixir
  pipeline :auth, do: plug(AuthPlug)

  scope "/", AppWeb do
    pipe_through :browser
    pipe_through :auth
    get "/admin", PageController, :admin
  end
```
5 - You're done! Your portected route now redirects you to a page where you sign in with whatever option you want.

## 2 - Making index route with login page.
It's a bit useless having a protected router path that does nothing but just...be protected. Instead, we should
add these auth capabilities to our main page and let the user *have the option* to login with Github or Google Drive
and use their username in following interactions!

//TODO continue after auth_plug is importable
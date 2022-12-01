defmodule Chat.MixProject do
  use Mix.Project

  def project do
    [
      app: :chat,
      version: "1.6.15",
      elixir: "~> 1.12",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      test_coverage: [tool: ExCoveralls],
      preferred_cli_env: [
        c: :test,
        coveralls: :test,
        "coveralls.detail": :test,
        "coveralls.json": :test,
        "coveralls.post": :test,
        "coveralls.html": :test,
        t: :test
      ]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Chat.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.6.14"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.9.0"},
      {:postgrex, ">= 0.16.5"},
      {:phoenix_html, "~> 3.2.0"},
      {:phoenix_live_reload, "~> 1.4.1", only: :dev},
      {:phoenix_live_view, "~> 0.18.2"},
      {:floki, ">= 0.33.1", only: :test},
      {:phoenix_live_dashboard, "~> 0.7.1"},
      {:esbuild, "~> 0.5", runtime: Mix.env() == :dev},
      {:swoosh, "~> 1.8.1"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.4"},
      {:plug_cowboy, "~> 2.6.0"},

      # See: github.com/dwyl/auth_plug
      {:auth_plug, "~> 1.5"},

      # See: github.com/dwyl/learn-tailwind
      {:tailwind, "~> 0.1.9", runtime: Mix.env() == :dev},

      # sanitise data to avoid XSS see: https://git.io/fjpGZ
      {:html_sanitize_ex, "~> 1.4.2"},

      # The rest of the dependendencies are for testing/reporting
      # tracking test coverage
      {:excoveralls, "~> 0.15.0", only: [:test, :dev]},
      # documentation
      {:inch_ex, "~> 2.1.0-rc.1", only: :docs},
      # github.com/dwyl/learn-pre-commit
      {:pre_commit, "~> 0.3.4", only: :dev}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "assets.deploy": ["tailwind default --minify", "esbuild default --minify", "phx.digest"],
      c: ["coveralls.html"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      s: ["phx.server"],
      setup: ["deps.get", "ecto.setup"],
      t: ["test"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end

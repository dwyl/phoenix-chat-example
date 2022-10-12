defmodule Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  schema "messages" do
    field :message, :string
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:name, :message])
    |> validate_required([:name, :message])
  end

  def get_messages(limit \\ 20) do
    Chat.Message
    |> limit(^limit)
    |> order_by(desc: :inserted_at)
    |> Chat.Repo.all()
  end
end

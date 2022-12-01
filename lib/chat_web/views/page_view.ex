defmodule ChatWeb.PageView do
  use ChatWeb, :view

  def person_name(person) do
    person.givenName || person.username || "guest"
  end
end

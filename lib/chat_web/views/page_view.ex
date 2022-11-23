defmodule ChatWeb.PageView do
  use ChatWeb, :view

  def person_name(person) do
    dbg(person)
    person.givenName || person.username || "guest"
  end
end

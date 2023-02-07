defmodule ChatWeb.PageHTML do
  use ChatWeb, :html

  embed_templates "page_html/*"

  def person_name(person) do
    person.givenName || person.username || "guest"
  end
end

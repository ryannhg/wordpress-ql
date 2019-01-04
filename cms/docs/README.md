# WordpressQL | CMS
> "It's not done until the docs are great."

## Introduction

These docs are here to show you all the configuration options available when creating a new WordpressQL backend.

It all starts with a `config.yaml` file that looks something like this:

```yaml
version: 1

pages:
  home:
    options:
      label: Homepage
      path: /
    fields:
      hero:
        title: Text
        subtitle: Text?
        image: Image
  people:
    options:
      label: People Landing
      path: /people
    fields:
      hero:
        title: Text

posts:
  people:
    options:
      label: People
      singular_label: Person
    fields:
      name:
        first: Text
        middle: Text?
        last: Text
      email: Text
      phone: Text
      bio:
        main: RichText
        additional: RichText?
```
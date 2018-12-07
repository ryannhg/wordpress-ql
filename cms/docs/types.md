# Posts

## Introduction

We are using a popular plugin called [Custom Post Type UI (or CPTUI)]() to allow us to generate custom things like "People", "Services", or "Publications".

Each custom type has a list of associated fields, which is made possible by the [Advanced Custom Fields (or ACF)]() plugin.


## Creating a Post

To create a new type of post, we can create an entry under the `posts` property in our `config.yaml`

```yaml
version: 1

posts:
  people:
    options: # ...
    fields: # ...
  services:
    options: # ...
    fields: # ...
  news:
    options: # ...
    fields: # ...
  events:
    options: # ...
    fields: # ...
```

Every custom post has two properties: `options` and `fields`.

`options` contain all the options for the custom post type, while `fields`

### Options (`options`)

#### API

Option Name | Type | Description | Default
---|---|---|---
`label` | `String?` | Plural label | (Prettifed version of `name`)
`singular_label` | `String?` | Singular label | (Value of `label`)
`hierarchical` | `Bool?` | Parent / child relationships? | `false`

#### Examples

```yaml
version: 1
posts:
  people:
    options:
      singular_label: Person
  services:
    options:
      hierarchical: true
```

### Fields (`fields`)


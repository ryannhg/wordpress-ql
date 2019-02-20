# WordpressQL
> Generating UI from YAML

## Overview

The goal of this project is to make a single YAML file be capable of defining your custom Wordpress post types and fields.

Luckily, both ACF and CPTUI already can read in Field Groups and Post Types from JSON.

Instead of typing out the JSON by hand, it's much easier to describe your data in a simpler format, like a YAML file, and have the JSON be deterministically generated, so it works better with source control like git.

## An example

If you were making a blog site, you might have something like this:

```yaml
pages:
  home:
    options:
      label: Homepage
      path: /
    fields:
      hero:
        title: Text
        backgroundImage: Image?
        ctaLabel: Text?
      about:
        label: Text
        content: Wysiwyg
posts:
  people:
    options:
      label: People
      singular_label: Person
    fields:
      name:
        first:
          - type: Text
            label: First Name
        last:
          - type: Text
            label: Last Name
```
# WordpressQL
> Wordpress + GraphQL

## Introduction

Wordpress has a nice UI. It also has some nice plugins for extending that UI.

This project hopes to leverage the work Wordpress has done, and combine it with the nice modelling and querying experience of GraphQL.

[Read more](/cms)

## Try it out!

1. (Temporarily a manual step) Generate models with `./cms/parser/index.js`
  - `cd cms/parser`
  - `npm install`
  - `node index.js`
  - `cd ../..`

1. __`docker-compose up`__


## Make models with code, not clicks

```yaml
# Define your pages
pages:
  home:
    # Define their fields
    fields:
      hero:
        title: Text
        backgroundImage: Image
        caption: RichText
        cta:
          label: Text
          url: Page

# Define custom post types
posts:
  people:
    # You can provide options too!
    options:
      label: People
      singular_label: Person
    fields:
      photo: Image
      name:
        first: Text
        middle: Text?
        last: Text
      bio:
        main: RichText
        additional: RichText?
```
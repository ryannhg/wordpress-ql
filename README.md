# WordpressQL
> Wordpress + GraphQL

## Introduction

Wordpress has a nice UI. It also has some nice plugins for extending that UI.

This project hopes to leverage the work Wordpress has done, and combine it with the nice modelling and querying experience of GraphQL.

### You provide this:

```yaml
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
        main: Wysiwyg
        additional: Wysiwyg?
```


### And you'll get back one of these:

![GraphIQL Screenshot]()


### While your users see this:

![Wordpress UI Screenshot]()


## Try it out!

1. __`docker-compose up`__

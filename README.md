# WordpressQL
> Wordpress + GraphQL

## Introduction

Wordpress has a nice UI. It also has some nice plugins for extending that UI.

This project hopes to leverage the work Wordpress has done, and combine it with the nice modelling and querying experience of GraphQL.

### You provide this:

```ts
type Query {
  books: [Book]
}

type Book {
  title: String
  author: Author
}

type Author {
  name: String
  bio: String
}
```


### And you'll get back one of these:

![GraphIQL Screenshot]()


### While your users see this:

![Wordpress UI Screenshot]()


## Try it out!

1. __`docker-compose up`__

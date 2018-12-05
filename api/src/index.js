const { ApolloServer, gql } = require('apollo-server')

// The GraphQL schema
const typeDefs = gql`
  type Query {
    getBooks(author: ID): [Book]
    getAuthors: [Author]
  }

  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }
`

const book = (id, title, author) =>
  ({ id, title, author })

const author = (id, name) =>
  ({ id, name })

const db = {
  books: [
    book(1, 'Harry Potter', 123),
    book(2, 'Harry Potter 2', 123),
    book(3, 'Lord of the Rings', 456)
  ],
  authors: [
    author(123, 'Pat Beecher'),
    author(456, 'Ryan Haskell-Glatz')
  ]
}

console.log(db)

const hasThisAuthor = authorId => book => book.author === authorId

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getBooks: (_, args) =>
      args.author
        ? db.books.filter(hasThisAuthor(parseInt(args.author)))
        : db.books,
    getAuthors: () => db.authors
  },
  Book: {
    author: (book) =>
      db.authors.filter(author => author.id === book.author)[0]
  },
  Author: {
    books: author =>
      db.books.filter(hasThisAuthor(author.id))
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})

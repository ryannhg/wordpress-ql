const { ApolloServer, gql } = require('apollo-server')
const db = require('./db')

// The GraphQL schema
const typeDefs = gql`
  type Query {
    people: [Person]
  }

  interface Post {
    _id: ID!
    _title: String!
    _slug: String!
  }

  type Person implements Post {
    _id: ID!
    _title: String!
    _slug: String!
    name: Name
    bio: Bio
  }

  type Name {
    first: String!
    last: String!
  }

  type Bio {
    main: String
    additional: String
  }
`

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    people: _ => db.get('people')
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

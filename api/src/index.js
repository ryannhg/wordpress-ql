const { ApolloServer, gql } = require('apollo-server')
const db = require('./db')

// The GraphQL schema
const typeDefs = gql`
  type Query {
    professionals: [Professional]
  }

  interface Post {
    _id: ID!
    _title: String!
    _slug: String!
  }

  type Professional implements Post {
    _id: ID!
    _title: String!
    _slug: String!
    name: Name
    biography: Bio
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
    professionals: _ => db.get('professionals')
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

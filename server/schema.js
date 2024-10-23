const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    timestamp: String!
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    addMessage(content: String!, senderId: ID!): Message
    register(username: String!, password: String!): User
    login(username: String!, password: String!): String # JWT token
  }
`);

module.exports = schema;
import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String
    username: String
    groups: [Group!]!
  }

  type Group {
    id: ID!
    name: String!
    inviteCode: String
    members: [User!]!
  }

  type Expense {
    id: ID!
    title: String!
    amount: Float!
    notes: String
    paidBy: User!
    group: Group!
    createdAt: String!
  }

  type Query {
    me: User
    groups: [Group!]!
    expenses(groupId: ID!): [Expense!]!
    users: [User!]!
  }

  type Mutation {
    createGroup(name: String!): Group!
    addExpense(groupId: ID!, title: String!, amount: Float!): Expense!
    createGroupWithMembers(name: String!, userIds: [ID!]!): Group!
  }
`;

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

  type ActivityLog {
    id: ID!
    message: String!
    user: User!
    group: Group!
    createdAt: String!
  }

  type Balance {
    from: User!
    to: User!
    amount: Float!
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

  type Settlement {
    id: ID!
    amount: Float!
    note: String
    settledBy: User!
    settledTo: User!
    group: Group
    createdAt: String!
  }

  type Query {
    me: User
    groups: [Group!]!
    expenses(groupId: ID!): [Expense!]!
    users: [User!]!
    balances(groupId: ID!): [Balance!]!
    activityLogs(groupId: ID!): [ActivityLog!]!
    myBalances: [Balance!]!
  }

  type Mutation {
    createGroup(name: String!): Group!
    createGroupWithMembers(name: String!, userIds: [ID!]!): Group!
    addExpense(
      groupId: ID!
      title: String!
      amount: Float!
      notes: String
      splitWith: [ID!]!
    ): Expense!

    settleUp(
      groupId: ID!
      toUserId: ID!
      amount: Float!
      note: String
    ): Settlement!

    createActivityLog(groupId: ID!, message: String!): ActivityLog!
  }
`;

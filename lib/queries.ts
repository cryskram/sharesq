import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      groups {
        id
        name
        inviteCode
      }
    }
  }
`;

export const USERS_QUERY = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      email
    }
  }
`;

export const CREATE_GROUP_WITH_MEMBERS = gql`
  mutation CreateGroupWithMembers($name: String!, $userIds: [ID!]!) {
    createGroupWithMembers(name: $name, userIds: $userIds) {
      id
      name
      inviteCode
    }
  }
`;

export const ADD_EXPENSE = gql`
  mutation AddExpense(
    $groupId: ID!
    $title: String!
    $notes: String
    $amount: Float!
  ) {
    addExpense(
      groupId: $groupId
      notes: $notes
      amount: $amount
      title: $title
    ) {
      id
      title
      amount
      notes
      createdAt
    }
  }
`;

export const EXPENSE_QUERY = gql`
  query Expenses($groupId: ID!) {
    expenses(groupId: $groupId) {
      id
      title
      amount
      notes
      createdAt
      paidBy {
        name
      }
    }
  }
`;

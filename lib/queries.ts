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
        members {
          id
          name
        }
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
    $splitWith: [ID!]!
  ) {
    addExpense(
      groupId: $groupId
      notes: $notes
      amount: $amount
      title: $title
      splitWith: $splitWith
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

export const GROUP_MEMBERS_QUERY = gql`
  query GetGroupMembers($groupId: ID!) {
    groups {
      id
      name
      members {
        id
        name
      }
    }
  }
`;

export const GET_BALANCES = gql`
  query GetBalances($groupId: ID!) {
    balances(groupId: $groupId) {
      from {
        id
        name
      }
      to {
        id
        name
      }
      amount
    }
  }
`;

export const SETTLE_UP = gql`
  mutation SettleUp(
    $groupId: ID!
    $toUserId: ID!
    $amount: Float!
    $note: String
  ) {
    settleUp(
      groupId: $groupId
      toUserId: $toUserId
      amount: $amount
      note: $note
    ) {
      id
      amount
      note
      createdAt
      settledBy {
        id
        name
      }
      settledTo {
        id
        name
      }
    }
  }
`;

export const ACTIVITY_LOGS = gql`
  query ActivityLogs($groupId: ID!) {
    activityLogs(groupId: $groupId) {
      id
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const CREATE_ACTIVITY_LOG = gql`
  mutation CreateActivityLog($groupId: ID!, $message: String!) {
    createActivityLog(groupId: $groupId, message: $message) {
      id
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const GET_MY_BALANCES = gql`
  query GetMyBalances {
    myBalances {
      from {
        id
        name
      }
      to {
        id
        name
      }
      amount
    }
  }
`;

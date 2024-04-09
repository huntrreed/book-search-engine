import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me($_id: ID!) {
    me(_id: $_id) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
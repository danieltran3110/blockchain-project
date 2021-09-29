import { gql } from '@apollo/client'


export const USER_LOAD = gql `
    query {
        getAllUsers {
            id,
            firstName,
            lastName,
            email,
            password
        }
    }
`;

export const GET_USER_BY_ID = gql `
    query getUserById($id: Int!) {
         user(id: $id) {
            id,
            firstName,
            lastName,
            email,
            password
        }
    }
`;
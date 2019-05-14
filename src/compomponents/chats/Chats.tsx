import React from 'react';

import { Query, QueryResult, OperationVariables } from "react-apollo";
import gql from 'graphql-tag';

const GET_CHATS = gql`
    query {
        getChats {
            id
            title
            messages {
            id
            text
            }
        }
    }
`

export default function Chats() {
    return (
        <Query query={GET_CHATS}>
        {(result: QueryResult<any, OperationVariables>) => {
            if (result.loading) return <div>loading...</div>;
            if (result.error) return <p>ERROR</p>;
            return (
                <div>{JSON.stringify(result.data.getChats)}</div>
              );
            }}
            </Query>
    )
}
import React from "react";
import { MutationFn, Mutation, OperationVariables } from "react-apollo";
import gql from "graphql-tag";
import Search from "antd/lib/input/Search";

const CREATE_CHAT = gql`
    mutation CreateChat ($title: String){
        createChat(title: $title) {
            id
            title
        }
    }
`


export class CreateChatButton extends React.Component {
  render() {
    return <Mutation mutation={CREATE_CHAT}>
      {(mutationFn: MutationFn<any, OperationVariables>) => {
        return <Search
          placeholder="input chat title"
          enterButton="Create Chat"
          size="small"
          onSearch={(title: string) => mutationFn({variables: {title }})}
        />
      }}
    </Mutation>
  }
}
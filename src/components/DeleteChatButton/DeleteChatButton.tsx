import React from "react";
import { Mutation, OperationVariables, MutationFn } from "react-apollo";
import { Button } from "antd";
import gql from "graphql-tag";

interface DeleteChatButtonProps {
  id: string
}

const DELETE_CHAT = gql`
  mutation DeleteChat ($id: ID){
      deleteChat(id: $id) {
          id
      }
  }
`

export class DeleteChatButton extends React.Component<DeleteChatButtonProps>{
  handleOnClick = (e: any, mutationFn: MutationFn<any, OperationVariables>) => {
    e.stopPropagation();
    mutationFn({variables: {id: this.props.id}})
  } 
  render() {
    return <Mutation mutation={DELETE_CHAT}>
      {(mutationFn: MutationFn<any, OperationVariables>, data: any) => {
          return <Button onClick={e => this.handleOnClick(e, mutationFn)}/>
      }}
    </Mutation>
  }
}
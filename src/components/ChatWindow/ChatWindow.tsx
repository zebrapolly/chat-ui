import React from "react";
import { Layout } from "antd";
import { Query, QueryResult, OperationVariables } from "react-apollo";
import gql from "graphql-tag";
import { ChatMessagesList } from "../ChatMessagesList/ChatMessagesList";
import { SubscribeToMoreOptions } from "apollo-client";

const { Content, Header } = Layout;

export enum MessagesUpdateType {
  DELETED = "DELETED",
  UPDATED = "UPDATED",
  CREATED = "CREATED"
}

interface Props {
  chat: any
}

const GET_CHAT = gql`
  query GetChat ($id: ID!){
    getChat(id: $id) {
      id
      title
      participants {
        id
        nick
      }
      messages {
        id
        author{
          id
          nick
        }
        timestamp
        text
      }
    }
  }
`

const SUBSCRIBE_CHAT_UPDATES = gql`
  subscription MessagesUpdated($id: ID){
    messagesUpdated(id: $id) {
      chatId
      message {
        id
        author{ 
          id
          nick
        }
        text
        timestamp
      }
      type 
    }
  }
`

export class ChatWindow extends React.Component<Props> {
  unsubscribe: any = null
  componentWillUpdate = () => {
    console.log('componentWillUpdate', this.unsubscribe)
    if (this.unsubscribe) {
    console.log('componentWillUpdate not null', this.unsubscribe)

      this.unsubscribe()

    }
  }
  subscribeToChatUpdates = (subscribeToMore: (options: SubscribeToMoreOptions<any, OperationVariables, any>) => () => void) => {
    return subscribeToMore({
      document: SUBSCRIBE_CHAT_UPDATES,
      variables: { id: this.props.chat.id },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('subscriptionData', subscriptionData)
        console.log('prev', prev)
        const messagesUpdated = subscriptionData.data.messagesUpdated;
        const message = messagesUpdated.message;
        if (!subscriptionData.data) return prev;
        if (messagesUpdated.type === MessagesUpdateType.CREATED) {
          const prevChat = {...prev.getChat}
          console.log('next', prevChat)
          prevChat.messages.push(message);
          return {
            getChat: prev.prevChat
          }
        }
        // return {
        //   getChat: prev.getChat
        // }
      },
    })
  }
  render() {
    console.log(this.props.chat)
    if (this.props.chat) {
      return <Layout>
        <Header><span style={{color: 'white'}}>{this.props.chat.title}</span></Header>
        <Query query={GET_CHAT} variables={{id: this.props.chat.id}}>
        {(result: QueryResult<any, OperationVariables>) => 
          <ChatMessagesList
            data={result.data}
            chatId={this.props.chat.id}
            subscribeToChatUpdates={(chatId: string) => {
              if (this.unsubscribe) {
                this.unsubscribe()
              }
              this.unsubscribe = this.subscribeToChatUpdates(result.subscribeToMore)
              return this.unsubscribe;
            }
              } 
          />
        }
      </Query>

      </Layout>
    }
    return <Layout>
      <Content style={{ margin: '24px 16px 16px'}}>
        Open any chat by clicking
      </Content>
    </Layout>  
  }
}

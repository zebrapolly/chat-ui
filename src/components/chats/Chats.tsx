import React from 'react';

import { Query, QueryResult, OperationVariables, Mutation, MutationFn } from "react-apollo";
import gql from 'graphql-tag';
import { Layout, Button } from 'antd';

import { ChatsList } from '../ChatsList/ChatsList';

const { Content, Sider } = Layout;

const CREATE_CHAT = gql`
    mutation CreateChat ($title: String){
        createChat(title: $title) {
            id
            title
        }
    }
`

const GET_CHATS = gql`
    query GetChats{
        getChats {
            id
            title
            lastMessage {
                text
            }
            messages {
            id
            text
            }
        }
    }
`

const GET_CHATS_UPDATES = gql`
    subscription ChatUpdates{
        chatUpdated {
            id
            title
            messages {
                id
            }
            lastMessage {
                text
            }
        }
    }
`
export class Chats extends React.Component {
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <CreateChatButton />
                    <Query query={GET_CHATS}>
                    {(result: QueryResult<any, OperationVariables>) => 
                        <ChatsList
                                chats={result.data.getChats}
                                subscribeToChatUpdates={() => 
                                    result.subscribeToMore({
                                        document: GET_CHATS_UPDATES,
                                        updateQuery: (prev, { subscriptionData }) => {
                                            if (!subscriptionData.data) return prev;
                                            const newChat = subscriptionData.data.chatUpdated;
                                            return Object.assign({}, prev, {
                                                getChats: [newChat, ...prev.getChats]
                                            });
                                            }
                                    })
                                }
                            />
                    }
                    </Query>
                </Sider>
                <Layout>
                    <Content style={{ margin: '24px 16px 16px'}}>
                        ddfsfsdfsdfsd
                    </Content>
                </Layout>
            </Layout>
    
        )
}
}

function CreateChatButton() {
    return <Mutation mutation={CREATE_CHAT}>
        {(mutationFn: MutationFn<any, OperationVariables>, data: any) => {
            return <Button onClick={e => mutationFn({variables: {title: 'test'}})}/>
        }}
    </Mutation>
}

import React from 'react';

import { Query, QueryResult, OperationVariables } from "react-apollo";
import gql from 'graphql-tag';
import { Layout } from 'antd';

import { ChatsList } from '../ChatsList/ChatsList';
import { CreateChatButton } from '../CreateChatButton/CreateChatButton';
export enum ChatsUpdateType {
    DELETED = "DELETED",
    UPDATED = "UPDATED",
    CREATED = "CREATED"
}

const { Content, Sider } = Layout;

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
                chat {
                    id
                    title
                    messages {
                        id
                        text
                    }
                    lastMessage {
                        text
                    }
            }
            type

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
                                chats={result.data!.getChats}
                                subscribeToChatUpdates={() => 
                                    result.subscribeToMore({
                                        document: GET_CHATS_UPDATES,
                                        updateQuery: (prev, { subscriptionData }) => {

                                            if (!subscriptionData.data) return prev;
                                            const chatUpdated = subscriptionData.data.chatUpdated;
                                            const chat = chatUpdated.chat;
                                            if (chatUpdated.type === ChatsUpdateType.CREATED) {
                                                return Object.assign({}, prev, {
                                                    getChats: [chat, ...prev.getChats]
                                                });
                                            }
                                            if (chatUpdated.type === ChatsUpdateType.DELETED) {

                                                const newChats = [...prev.getChats];
                                                newChats.find((item: any, index: number) => {
                                                    if (item.id === chat.id) {
                                                        newChats.splice(index, 1);
                                                        return true;
                                                    }
                                                    return false;
                                                })
                                                return {
                                                    getChats: newChats
                                                };
                                            }
                                            if (chatUpdated.type === ChatsUpdateType.UPDATED) {

                                                const newChats = [...prev.getChats];
                                                newChats.find((item: any) => {
                                                    if (item.id === chat.id) {
                                                        item = subscriptionData.data.chatUpdated.chat; // Need refactoring
                                                        return true;
                                                    }
                                                    return false;
                                                })
                                                return {
                                                    getChats: newChats
                                                };
                                            }
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

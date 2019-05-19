import React from 'react';

import { Query, QueryResult, OperationVariables } from "react-apollo";
import gql from 'graphql-tag';
import { Layout } from 'antd';

import { ChatsList } from '../ChatsList/ChatsList';
import { CreateChatButton } from '../CreateChatButton/CreateChatButton';
import { ChatWindow } from '../ChatWindow/ChatWindow';

export enum ChatsUpdateType {
    DELETED = "DELETED",
    UPDATED = "UPDATED",
    CREATED = "CREATED"
}

const { Sider } = Layout;

const GET_CHATS = gql`
    query GetChats{
        getChats {
            id
            title
            lastMessage {
                text
            }
        }
    }
`

const GET_CHATS_UPDATES = gql`
    subscription ChatsUpdates{
        chatsUpdated {
                chat {
                    id
                    title
                    lastMessage {
                        text
                    }
            }
            type

        }
    }
`

interface State {
    openedChat: string | null
}

export class Chats extends React.Component<{}, State> {
    state: State = {
        openedChat: null
    }
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <CreateChatButton />
                    <Query query={GET_CHATS}>
                    {(result: QueryResult<any, OperationVariables>) => 
                        <ChatsList
                                chats={result.data!.getChats}
                                handleOpenChat={(chat: any) => {
                                    this.setState({
                                        openedChat: chat
                                    })
                                }}
                                subscribeToChatsUpdates={() => 
                                    result.subscribeToMore({
                                        document: GET_CHATS_UPDATES,
                                        updateQuery: (prev, { subscriptionData }) => {
                                            // console.log('subscriptionData1', subscriptionData)
                                            // console.log('prev1', prev)
                                            if (!subscriptionData.data) return prev;
                                            const chatsUpdated = subscriptionData.data.chatsUpdated;
                                            const chat = chatsUpdated.chat;
                                            if (chatsUpdated.type === ChatsUpdateType.CREATED) {
                                                return Object.assign({}, prev, {
                                                    getChats: [chat, ...prev.getChats]
                                                });
                                            }
                                            if (chatsUpdated.type === ChatsUpdateType.DELETED) {

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
                                            if (chatsUpdated.type === ChatsUpdateType.UPDATED) {

                                                const newChats = [...prev.getChats];
                                                newChats.find((item: any) => {
                                                    if (item.id === chat.id) {
                                                        item = subscriptionData.data.chatsUpdated.chat; // Need refactoring
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
                <ChatWindow chat={this.state.openedChat} /> 
            </Layout>
    
        )
    }
}

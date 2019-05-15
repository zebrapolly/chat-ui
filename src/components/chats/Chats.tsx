import React from 'react';

import { Query, QueryResult, OperationVariables, Mutation, MutationResult, MutationFn } from "react-apollo";
import gql from 'graphql-tag';
import { Card, Layout, Menu, Button } from 'antd';

import {Chat} from '../../../../typings/types';

const { Content, Header, Sider } = Layout;

const CREATE_CHAT = gql`
    mutation CreateChat ($title: String){
        createChat(title: $title) {
            id
            title
        }
    }
`

const GET_CHATS = gql`
    query {
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

export default function Chats() {
    return (
        <Query query={GET_CHATS}>
        {(result: QueryResult<any, OperationVariables>) => {
            if (result.loading) return <div>loading...</div>;
            if (result.error) return <p>ERROR</p>;
            console.log(result.data.getChats)
            return (
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider>
                        <CreateChatButton />
                        <Menu
                            theme="dark"
                            mode="inline"
                        >
                            {result.data.getChats.map((item: Chat) => {
                                return <Menu.Item key={item.id} style={{height: 80}}>
                                    <Card title={item.title} size="small">
                                    <p>{item.lastMessage ? item.lastMessage.text : ''}</p>

                                    </Card>
                                </Menu.Item>
                            })}

                        </Menu>
                        </Sider>
                    <Layout>

                        <Content style={{ margin: '24px 16px 16px'}}>
                            ddfsfsdfsdfsd
                        </Content>
                    </Layout>

                    </Layout>
              );
            }}
            </Query>
    )
}

function CreateChatButton() {
    return <Mutation mutation={CREATE_CHAT}>
    {(mutationFn: MutationFn<any, OperationVariables>, data: any) => {
        return <Button onClick={e => mutationFn({variables: {title: 'test'}})}/>
    }}
    </Mutation>
}
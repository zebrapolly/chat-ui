import React from 'react';

import { Query, QueryResult, OperationVariables } from "react-apollo";
import gql from 'graphql-tag';
import { Card, Layout, Menu } from 'antd';

const { Content, Header } = Layout;

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
            console.log(result.data.getChats)
            return (
                // <Layout>
                <div>
                    <Layout style={{ width: '100 px' }}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                    </Layout>
                    <Layout>
                        <Content style={{ margin: '24px 16px 16px', overflow: 'initial' }}>
                            {result.data.getChats.map((item: any) => {
                                return <Card title={item.title} key={item.id} style={{ width: 300 }}/>
                            })}
                        </Content>
                    </Layout>
                </div>
              );
            }}
            </Query>
    )
}
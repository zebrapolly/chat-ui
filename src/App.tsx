import React from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import './App.css';
import Chats from './compomponents/chats/Chats';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:3000/graphql'
})
const client = new ApolloClient({
  cache,
  link
})

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
    <Chats />
    </ApolloProvider>
  );
}

export default App;

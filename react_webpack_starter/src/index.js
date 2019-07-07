import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/MyApp'
import './diy/rem';
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state';
import { BrowserRouter } from "react-router-dom";
import { typeDefs } from './graqhql/typeDefs'
import resolvers from './graqhql/resolvers'

const cache = new InMemoryCache(); 

const client = new ApolloClient({
     cache,
     link: withClientState({ resolvers, defaults: {
        counter: 440,
        todos: [
            {
                completed: false,
                id: 0,
                text: "dddd",
                __typename: "TodoItem"
            },
            {
                completed: false,
                id: 1,
                text: "eeee",
                __typename: "TodoItem"
            }
        ]
     }, cache, typeDefs })
})

ReactDOM.render(
   <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>  
   </BrowserRouter> ,
   document.getElementById('root'))
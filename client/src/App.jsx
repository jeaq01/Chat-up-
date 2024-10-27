import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useState,  } from 'react';
import './App.css'; 
import './styles/styles.css'
import './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';

const client = new ApolloClient({
    uri: 'http://localhost:10000/graphql',
    cache: new InMemoryCache(),
});



const App = () => {   
    const [token, setToken] = useState(null);  
    const [username, setUsername] = useState(null)
 
    return <ApolloProvider client={client}>
        {
            token ? 
                <Chat username={username}></Chat>
             : 
                <Login setToken={setToken} updateUsername={setUsername}></Login>                   
        }
    </ApolloProvider>
};

export default App;
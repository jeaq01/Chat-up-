import { ApolloClient, ApolloProvider, InMemoryCache, useQuery, useMutation, gql } from '@apollo/client';
import { io } from 'socket.io-client';
import { useState } from 'react';
import './App.css'; 

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
    query {
        messages {
            id
            content
            sender
            timestamp
        }
    }
`;

const ADD_MESSAGE = gql`
    mutation($content: String!, $sender: String!) {
        addMessage(content: $content, sender: $sender) {
            id
            content
            sender
            timestamp
        }
    }
`;

const REGISTER = gql`
    mutation($username: String!, $password: String!) {
        register(username: $username, password: $password) {
            id
            username
        }
    }
`;

const LOGIN = gql`
    mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            user {
                id
                username
            }
            token
        }
    }
`;

const Chat = () => {
    const { loading, error, data } = useQuery(GET_MESSAGES);
    const [addMessage] = useMutation(ADD_MESSAGE);
    const [register] = useMutation(REGISTER);
    const [login] = useMutation(LOGIN);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const socket = io('http://localhost:3000');

    const handleSend = async () => {
        const message = { content: newMessage, sender: username };
        socket.emit('sendMessage', message);
        await addMessage({ variables: message });
        setNewMessage('');
    };

    const handleRegister = async () => {
        await register({ variables: { username, password } });
    };

    const handleLogin = async () => {
        const { data } = await login({ variables: { username, password } });
        setToken(data.login.token);
    };

    // useEffect(() => {
    //     socket.on('message', (message) => {
    //         // we ca update this state with incoming messages
    //     });
    // }, [socket]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div className="chat-container">
            {token ? (
                <div>
                    <div className="message-list">
                        {data.messages.map(message => (
                            <div key={message.id}>
                                <strong>{message.sender}:</strong> {message.content}
                            </div>
                        ))}
                    </div>
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            ) : (
                <div>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
    );
};

const App = () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);

export default App;
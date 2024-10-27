import { ApolloClient, ApolloProvider, InMemoryCache, useQuery, useMutation, gql } from '@apollo/client';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import './App.css'; 
import './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';

const socket = io('http://localhost:3000');


const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
});




// const Chat = () => {
//     const { loading, error, data, refetch } = useQuery(GET_MESSAGES);
//     const [addMessage] = useMutation(ADD_MESSAGE);
//     const [register] = useMutation(REGISTER);
//     const [login] = useMutation(LOGIN);
//     const [newMessage, setNewMessage] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [token, setToken] = useState(null);  
    
//     useEffect(() => {                
//         socket.on('connect', () => {            
//         });
//         socket.on('newMessage', (message) => {    
//             refetch();                    
//         });
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const handleSend = async () => {
//         const message = { message: newMessage, username: username };        
//         socket.emit('sendMessage', message);
//         await addMessage({ variables: message });
//         setNewMessage('');
//     };

//     const handleRegister = async () => {
//         var response = await register({ variables: { username, password } });
//         console.log(response)
//     };

//     const handleLogin = async () => {
//         const { data } = await login({ variables: { username, password } });
//         console.log(data)
//         setToken(data.login.token);
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error){      
//       return <p>Error!</p>;
//     } 

//     return (
//         // <div className="chat-container">
//         //     {token ? 
//         //     // (

//         //         // <div>
//         //         //     <div className="message-list">
//         //         //         {data.messages.map(message => (
//         //         //             <div key={message.id}>
//         //         //                 <strong>{message.username}:</strong> {message.message}
//         //         //             </div>
//         //         //         ))}
//         //         //     </div>
//         //         //     <input
//         //         //         value={newMessage}
//         //         //         onChange={(e) => setNewMessage(e.target.value)}
//         //         //         placeholder="Type a message"
//         //         //     />
//         //         //     <button onClick={handleSend}>Send</button>
//         //         // </div>
//         //     // )
//         //      : 
//         //         <Login></Login>
//         //     }
//         // </div>
//     );
// };

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
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { io } from 'socket.io-client';
const socket = io('/');
import './Chat.css';

const GET_MESSAGES = gql`
    query {
        messages {
            id
            message
            username
            timestamp
        }
    }
`;

const ADD_MESSAGE = gql`
    mutation($message: String!, $username: String!) {
        addMessage(message: $message, username: $username) {  
            id          
            message
            username            
        }
    }
`;

function Chat({username}) {

    const { loading, error, data, refetch } = useQuery(GET_MESSAGES);
    const [addMessage] = useMutation(ADD_MESSAGE);

    const [newMessage, setNewMessage] = useState('');

    const handleSend = async () => {
            const message = { message: newMessage, username: username };        
            socket.emit('sendMessage', message);
            await addMessage({ variables: message });
            setNewMessage('');
    };

    useEffect(() => {                
                socket.on('connect', () => {            
                });
                socket.on('newMessage', () => {    
                    refetch(); //Fetch all messages again
                });
                return () => {
                    socket.disconnect();
                };
            }, []);

    if (loading) return <p>Loading...</p>;
    if (error){      
      return <p>Error!</p>;
    } 

    function formatDateString(dateString) {
        const date = new Date(dateString);
        
        // Get month abbreviation
        const month = date.toLocaleString("en-US", { month: "short" });
        
        // Get day
        const day = date.getDate();
        
        // Get hours and minutes
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        
        // Determine AM/PM
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format
    
        // Construct the formatted date string
        return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
    }

    return (
        <div className='chat_container'>
            <div className="message-list">
                {data.messages.map(message => (
                    <div style={{alignSelf: username == message.username ? 'end' : 'start'}} className='message_bubble_container'>
                        <strong style={{alignSelf: username == message.username ? 'end' : 'start'}}>{message.username}</strong>
                        <div className='message_bubble' style={{backgroundColor: username == message.username ? '#024CAA' : '#000000', borderEndEndRadius: username == message.username ? 0 : 10, borderEndStartRadius: username == message.username ? 10 : 0}} key={message.id}>
                            {message.message}
                        </div>
                        <p className='message_datetime' style={{alignSelf: username == message.username ? 'end' : 'start'}}>{formatDateString(message.timestamp)}</p>
                    </div>
                ))}
            </div>
            <div className='chat_input_container'>
                <input
                    className='chat_input'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button id='sendMessage' onClick={handleSend}>Send</button>
            </div>
        </div>
    )
};

export default Chat;
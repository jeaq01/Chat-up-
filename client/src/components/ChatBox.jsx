import { useState, useEffect, useRef } from "react";
import ChatHistory from "./ChatHistory";
import { io } from "socket.io-client";

const ChatBox = () => {
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io("http://localhost:3000");

        socketRef.current.on("connect", () => {
            console.log(socketRef.current.id);
        });

        socketRef.current.on("previousMessages", (data) => {
            console.log(data);
            setMessages(data);
        });

        socketRef.current.on("newMessage", (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socketRef.current.on("disconnect", () => {
            console.log(socketRef.current.id);
        });

        // Cleanup on component unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            date: Date.now(),
            message: newMessage,
            username: "test_username"
        };
        console.log(messageData)
        socketRef.current.emit('sendMessage', messageData);
        setNewMessage('');
    };

    return (
        <div className="chat">
            <div className="chat-history">
                <ul className="m-b-0">
                    {messages.map((message, idx) => (
                        <ChatHistory 
                            key={idx}
                            date={message.timestamp} 
                            message={message.message} 
                            messengerId={message.messengerId} // Corrected here
                        />
                    ))}
                </ul>
            </div>
            <div className="chat-message clearfix">
                <div className="input-group mb-0">
                    <form onSubmit={sendMessage}>
                        <input
                            id="chat-input-box"
                            type="text"
                            className="form-control"
                            placeholder="Enter text here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="input-group-prepend" type="submit">
                            <span className="input-group-text"><i className="fa fa-send"></i></span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
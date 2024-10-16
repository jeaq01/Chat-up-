// Chat page where users can send messages and also receive messages

import ChatBox from "../components/ChatBox";
import Chats from "../components/Chats";

// Needed components: Input box to type a message, Box to display messages

const Chat = () => {
    return (
            <div className="container">
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card chat-app">
                            {/* Left column that displays different chats */}
                            <Chats />
                            <ChatBox />
                        </div>
                    </div>
                </div>
            </div>
    )
};

export default Chat;
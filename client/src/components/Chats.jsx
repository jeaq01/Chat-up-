// This file contains the content for the Chat page. It is the left hand column that displays all chats

import { useState } from "react";
import ChatTab from "./ChatTab";

// const[socket, setSocket] = useState();

const users = [
    {
        username: "Vincent Porter",
        icon: "https://bootdey.com/img/Content/avatar/avatar1.png"
    },
    {
        username: "Aiden Chavez",
        icon: "https://bootdey.com/img/Content/avatar/avatar2.png"
    },
    {
        username: "Mike Thomas",
        icon: "https://bootdey.com/img/Content/avatar/avatar3.png"
    }
]

const Chats = () => {
    return (
        <div id="plist" className="people-list">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                </div>
                <input type="text" className="form-control" placeholder="Search..."></input>
            </div>
            <ul className="list-unstyled chat-list mt-2 mb-0">
                {users.map((user, idx) => <ChatTab key={idx} username={user.username} icon={user.icon} />)}
            </ul>
        </div>
    )
};



export default Chats;
// This file contains the content for the Chat page. It is the left hand column that displays all chats

import { useState } from "react";
import ChatTab from "./ChatTab";
import dummyDataUsers from "./dummyDataUsers"

const Chats = () => {

    // const users = dummyDataUsers;
    const [users, setUsers] = useState(dummyDataUsers)

    function clearSearch() {
        setUsers([])
    }

    function changeHandler(event) {
        const searchWord = event.target.value
        console.log(searchWord);

        const filteredUsers = dummyDataUsers.filter(userdata => {
            if(userdata.username.toLowerCase().includes(searchWord.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        });

        console.log(filteredUsers)
        setUsers(filteredUsers)
    }

    return (
        <div id="plist" className="people-list">
            <button onClick={clearSearch}>Clear</button>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                </div>
                <input onChange={changeHandler} type="text" className="form-control" placeholder="Search..."></input>
            </div>
            <ul className="list-unstyled chat-list mt-2 mb-0">
                {users.map((user, idx) => <ChatTab key={idx} username={user.username} icon={user.icon} />)}
            </ul>
        </div>
    )
};

export default Chats;
// This is the chat box component the for Chat page

import { useState } from "react";
import ChatHistory from "./ChatHistory";
// Replace this with your data from your database
// 1. Finish server folder (Set up express, Setup Mongo)
// 2. Replace messages and users with data from your database
// 3. Finish styling on front end

const ChatBox = () => {

    const [messages, setMessages] =  useState([
        {
            date: "10:10 AM, Today",
            message: "Hi Aiden, how are you? How is the project coming along?",
            mesengerId: 2
        },
        {
            date: "10:12 AM, Today",
            message: "Are we meeting today?",
            mesengerId: 1
        },
        {
            date: "10:15 AM, Today",
            message: "Project has been already finished and I have results to show you.",
            mesengerId: 1 // ID eventually should be the userId from your database
        }
    ])


    const sendMessage = (event) => {
        if((event.type == "keydown" && event.key === 'Enter') || event.type == "click") {
                const chatInputBox = document.getElementById("chat-input-box");
                
                setMessages([
                    ...messages,
                    {
                        date: "11:15 AM, Today",
                        message: chatInputBox.value,
                        mesengerId: 1 
                    }
                ])


        }
      };


    return (
        <div className="chat">
                                {/* Chat box */}
                                <div className="chat-header clearfix">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar"></img>
                                            </a>
                                            <div className="chat-about">
                                                <h6 className="m-b-0">Aiden Chavez</h6>
                                                <small>Last seen: 2 hours ago</small>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 hidden-sm text-right">
                                            <a href="javascript:void(0);" className="btn btn-outline-secondary"><i className="fa fa-camera"></i></a>
                                            <a href="javascript:void(0);" className="btn btn-outline-primary"><i className="fa fa-image"></i></a>
                                            <a href="javascript:void(0);" className="btn btn-outline-info"><i className="fa fa-cogs"></i></a>
                                            <a href="javascript:void(0);" className="btn btn-outline-warning"><i className="fa fa-question"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-history">
                                    <ul className="m-b-0">
                                        {/* <li className="clearfix">
                                            <div className="message-data text-right">
                                                <span className="message-data-time">10:10 AM, Today</span>
                                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar"></img>
                                            </div>
                                            <div className="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                                        </li>
                                        <li className="clearfix">
                                            <div className="message-data">
                                                <span className="message-data-time">10:12 AM, Today</span>
                                            </div>
                                            <div className="message my-message">Are we meeting today?</div>
                                        </li>
                                        <li className="clearfix">
                                            <div className="message-data">
                                                <span className="message-data-time">10:15 AM, Today</span>
                                            </div>
                                            <div className="message my-message">Project has been already finished and I have results to show you.</div>
                                        </li> */}
                                        {messages.map((message, idx) => < ChatHistory date={message.date} message={message.message} messengerId={message.mesengerId}/>)}
                                    </ul>
                                </div>
                                <div className="chat-message clearfix">
                                    {/* Input box */}
                                    <div className="input-group mb-0">
                            
                                        <input 
                                            id="chat-input-box"
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Enter text here..."
                                            onKeyDown={sendMessage}
                                        ></input>            
                                        <button className="input-group-prepend" onClick={sendMessage}>
                                            <span className="input-group-text"><i className="fa fa-send"></i></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
    )
};

export default ChatBox;
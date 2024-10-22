// This is where the messages will be displayed

const ChatHistory = ({date, message, messengerId}) => {
    return (
        <li className="clearfix">
            <div className="message-data text-right">
                <span className="message-data-time">{date}</span>
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar"></img>
            </div>
            <div className={messengerId !== 1 ? "message other-message float-right" : "message my-message"}>{message}</div>
        </li>
    )
};

export default ChatHistory;
// This is part of the Chats component which displays each chat on the left hand column
// We separated this because eventually this will pull data from our database
const ChatTab = ({ username, icon }) => {
    return (
        <li className="clearfix">
            <img src={icon} alt="avatar"></img>
            <div className="about">
                <div className="name">{username}</div>
                <div className="status"> <i className="fa fa-circle offline"></i> online since Oct 28 </div>
            </div>
        </li>
    )
};

export default ChatTab;
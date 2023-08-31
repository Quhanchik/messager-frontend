import { useSelector } from "react-redux";
import searchIcon from '../../icons/search.svg';
import moreIcon from '../../icons/more.svg';
import './ChatHeader.scss';

const ChatHeader = () => {
    const chats = useSelector(state => state.user.chats);
    const activeChat = useSelector(state => state.activeChat);

    const getTitle = (chats) => {
        return chats.map(element => {
            if(element.id === activeChat.value) {
                return <div className="chatHeader_title">{element.title}</div>
            }
        })
    }

    const getMembers = (chat) => {
        let members = '';

        chat.members.forEach((element, i) => {
            members += element.fullname + ', ';
        });

        return <div className="chatHeader_members">{members.slice(0, members.length - 2)}</div>
    }

    const getActiveChat = (chats) => {
        const chat = chats.filter(element => {
            if(element.id === activeChat.value) {
                return element;
            }
        })

        return chat[0];
    }

    return (
        <div className="chatHeader">
           <div className="chatHeader_mainWrapper">
           <img src={getActiveChat(chats).avatar} alt="" className="chatHeader_avatar"/>
            <div className="chatHeader_wrapper">
                {getTitle(chats)}
                {getMembers(getActiveChat(chats))}
            </div>
           </div>
            <div className="chatHeader_icons">
                <img className='chatHeader_searchIcon' src={searchIcon} alt="" />
                <img className='chatHeader_moreIcon' src={moreIcon} alt="" />
            </div>
        </div>

    )
}

export default ChatHeader;
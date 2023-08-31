import { useEffect, useRef, useState } from 'react';
import './LeftBar.scss';
import Menu from '../menu/Menu';
import ChatList from '../chatList/ChatList';
import SearchList from '../searchList/SearchList';
import { useDispatch, useSelector } from 'react-redux';
import FriendList from '../friendList/FriendList';
import NewGroup from '../newGroup/NewGroup';
import SockJsClient from 'react-stomp';
import { addChat } from '../../slices/userSlice';
import back from '../../icons/back.svg'
import React from 'react';

const LeftBar = ({clientRef}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isFriendOpen, setIsFriendOpen] = useState(false);
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [isChatList, setIsChatList] = useState(true);

    const activeChat = useSelector(state => state.activeChat);
    const chats = useSelector(state => state.user.chats);
    const dispatch = useDispatch();

    const subs = () => {
        return chats.map(elem => {
            return `/${elem.id}/chats`
        })
    }

    useEffect(() => {

        if(searchText.length > 0) {
            setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    }, [searchText])

    const onSearch = (e) => {
        setSearchText(e.currentTarget.value);
    }

    return(
        <div className="leftBar">
            <div className="leftBar_header">
                <div>
                    {
                        isChatList
                        ?<div className="leftBar_hamburger" onClick={() => setIsOpen(!isOpen)}>
                            <span></span>
                        </div>
                        : <img className='leftBar_arrow' src={back} alt="" onClick={() => {
                            setIsChatList(true);
                            setIsFriendOpen(false);
                            setIsOpen(false);
                            setIsSearch(false);
                            setIsNewGroup(false);
                            setSearchText('');
                        }}/>
                    }
                    {isOpen && <Menu setIsChatList={setIsChatList} setIsSearch={setIsSearch} setIsNewGroup={setIsNewGroup} setIsFriendOpen={setIsFriendOpen} setIsOpen={setIsOpen}/>}
                </div>
                <form className="leftBar_searchForm">
                    <input 
                        type="text" 
                        placeholder='find person or group'
                        // onBlur={() => setSearchText('')}
                        value={searchText}
                        onChange={(e) => onSearch(e)}
                        onFocus={() => {
                            setIsOpen(false);
                            setIsFriendOpen(false);
                            setIsChatList(false);
                        }}
                    />
                </form>
            </div>
            {isSearch 
            ? <SearchList clientRef={clientRef} text={searchText}/> 
            : (isFriendOpen ? <FriendList/> 
            : (isNewGroup ? <NewGroup clientRef={clientRef} setIsNewGroup={setIsNewGroup}/> : <ChatList/>))}
        </div>
    )
}

export default LeftBar;
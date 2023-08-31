import { useDispatch, useSelector } from 'react-redux';
import './Chat.scss';
import { useEffect, useRef } from 'react';

import SockJS from 'sockjs-client';
import { over } from 'stompjs';

import Messages from '../messages/Messages';
import ChatHeader from '../chatHeader/ChatHeader';
import ChatBottom from '../chatBottom/ChatBottom';
import SockJsClient from 'react-stomp';
import { addMessage } from '../../slices/userSlice';
import React from 'react';

const Chat = ({clientRef}) => {
    // const sock = new SockJS('http://localhost:8080/ws');
    // const chats = useSelector(state => state.user.chats);

    return (
        <div className="chat">
            <ChatHeader/>
            <Messages clientRef={clientRef}/>
            <ChatBottom clientRef={clientRef}/>
        </div>
    )
}

export default Chat;
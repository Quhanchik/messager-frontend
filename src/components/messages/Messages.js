import { useEffect, useRef, useState } from 'react';
import MyMessage from '../myMessage/MyMessage';
import OtherMessage from '../otherMessage/OtherMessage';
import './Messages.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, addMessage, appendMessages } from '../../slices/userSlice';
import EmptyChatError from '../emptyChatError/EmptyChatError';

import SockJS from 'sockjs-client';
import Stomp, { client } from 'stompjs';
import SockJsClient from 'react-stomp';
import useOnScreen from '../hooks/useOnScreen';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import ContextMenu from '../contextMenu/ContextMenu';

const Messages = ({clientRef}) => {
    const activeChat = useSelector(state => state.activeChat);
    const [page, setPage] = useState(0);
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [maxHeight, setMaxHeight] = useState(true);
    const initState = useRef(true);
    const pageRef = useRef(0);
    const [isContextMenu, setIsContextMenu] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [views, setViews] = useState([]);
    const lastMsgIdRef = useRef(0);

    const [end, setEnd] = useState(false);
    const isInitialState = useRef(true);
    // let sock = new SockJS("http://localhost:8080/ws");
    // let client = Stomp.over(sock);
    const isInitState = useRef(true);
    const [msgId, setMsgId] = useState(0);

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     client.subscribe(`/app/chat`, {}, JSON.stringify({
    //         text: 'test',
    //         sender: 47,
    //         chatId: 1
    //     }));
    // })

    // const send = () => {
    //     console.log('send');
    //     client.send(`/topic/messages`, {}, JSON.stringify({
    //         text: 'test',
    //         sender: 47,
    //         chatId: 1
    //     }));
    // }

    useEffect(() => {
        if(isInitState.current) {
            isInitState.current = false;
        } else {
            if(user.chats.filter(elem => elem.id == activeChat.value)[0].messages.length > 0) {
                pageRef.current = user.chats.filter(elem => elem.id == activeChat.value)[0].messages[0].number;
            } else {
                pageRef.current = 0;
            }
            // if(user.chats.find(elem => elem.id == activeChat.value).messages[0]) {
            //     if(user.chats.find(elem => elem.id == activeChat.value).messages[0].number != 0) {
            //         console.log('return');
            //         return;
            //     }
            // }

            const block = document.querySelector('.messages');
            setMessagesLoaded(false);
                    setTimeout( () => fetch('http://localhost:8080/message/pagination', {
                        method: "POST",
                        body: JSON.stringify({
                            chatId: activeChat.value,
                            page: pageRef.current
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
                        }
                    }).then(res => {
                        if(res.status != 403) {
                           return res.json()
                        }  else {
                            return {
                                content: [],
                                empty: true
                            }
                        }
                    })
                    .then(data => {
                        if(!data.empty) {
                            dispatch(setMessages({
                                activeChat: activeChat.value,
                                messages: data
                            }));
                            pageRef.current += 1;
                        }
                        setMessagesLoaded(true);
                    }), 100)

            setTimeout(() => block.scrollTo(0, block.scrollHeight), 150);
        }
    },[activeChat]);

    // useEffect(() => {
    //     const block = document.querySelector('.messages');
    //     setMessagesLoaded(false);
    //         fetch('http://localhost:8080/message/pagination', {
    //         method: "POST",
    //         body: JSON.stringify({
    //             chatId: activeChat.value,
    //             page
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
    //         }
    //     }).then(res => res.json())
    //     .then(data => {
    //         // console.log(data);
    //         dispatch(appendMessages({
    //             activeChat: activeChat.value,
    //             messages: data
    //         }));
    //         setMessagesLoaded(true);
    //         setPage(page + 1);
    //     }) 

    //     block.scrollTo(0, block.scrollHeight);
    //     console.log(block.scrollTop);
    // },[]);

//     const elementRef = useRef(null);
//   const isOnScreen = useOnScreen(elementRef);
    const cbRef = useIntersectionObserver({ threshold: 1 }, (entries) => {
        const block = document.querySelector('.messages');
        const oldHeigth = block.scrollHeight;
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                const currPage = user.chats.find(elem => elem.id == activeChat)
                fetch('http://localhost:8080/message/pagination', {
                    method: "POST",
                    body: JSON.stringify({
                        chatId: activeChat.value,
                        page: pageRef.current
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
                    }
                }).then(res => res.json())
                .then(data => {
                    if(!data.empty) {
                        dispatch(setMessages({
                            activeChat: activeChat.value,
                            messages: data
                        }));
                        setMessagesLoaded(true);
                        pageRef.current += 1;
                        setTimeout(() => block.scroll(0, block.scrollHeight - oldHeigth), 20);
                    }
                }) 
            }
        })
      })

    const content = () => {

        const messages = user.chats.filter(item => {
            if(item.id === activeChat.value) {
                return item.messages;
            }
        })[0].messages;

        if(messages.length === 0) {
            return (
                <EmptyChatError/>
            )
        }

        let res = messages.map(msg => {
            return msg.content.map(elem => {
                return elem.sender.id == window.localStorage.getItem('id')
                ? <MyMessage key={msg.id} lastMsgIdRef={lastMsgIdRef} setMsgId={setMsgId} setViews={setViews} setIsContextMenu={setIsContextMenu} setX={setX} setY={setY} msg={elem} clientRef={clientRef}/>
                : <OtherMessage key={msg.id} lastMsgIdRef={lastMsgIdRef} msg={elem} clientRef={clientRef} />
            })
        });

        return (
            [<div ref={cbRef} className='hidden'></div>, ...res]
        )
    }

    // const onSeen = () => {
    //     console.log(user.chats.find(elem => elem.id == activeChat.value));
    //     if(user.chats.find(elem => elem.id == activeChat.value).messages[0]) {
    //         if(user.chats.find(elem => elem.id == activeChat.value).messages[0].totalPages <= page || document.querySelector('.messages').scrollTop > 200) {
    //             console.log('return');
    //             return;
    //         }
    //     }
    //     if(user.chats.find(elem => elem.id == activeChat.value).messages[0]) {
    //         console.log(user.chats.find(elem => elem.id == activeChat.value).messages[0].totalPages);
    //         console.log(page);
    //     }

    //     const block = document.querySelector('.messages');
    //     const oldHeight = block.scrollHeight;
    //     fetch('http://localhost:8080/message/pagination', {
    //         method: "POST",
    //         body: JSON.stringify({
    //             chatId: activeChat.value,
    //             page
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
    //         }
    //     }).then(res => res.json())
    //     .then(data => {
    //         // console.log(data.content);
    //         dispatch(appendMessages({
    //             activeChat: activeChat.value,
    //             messages: data
    //         }));
    //         setMessagesLoaded(true);
    //         setPage(page + 1);
    //         // const block = document.querySelector('.messages');
    //         block.scrollTo(0, block.scrollHeight);
    //     })
        
    //     block.scrollTo(0, block.scrollHeight - oldHeight);
    // }

    return (
        <div className="messages">
           <div className="messages_wrapper">  
                {isContextMenu ? <ContextMenu msgId={msgId} setIsContextMenu={setIsContextMenu} x={x} y={y} views={views}/> : null}      
                {messagesLoaded && content()}
           </div>
        </div>
    )
}

export default Messages;
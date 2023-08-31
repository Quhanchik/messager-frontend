import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LeftBar from "../../leftBar/LeftBar";
import RightBar from "../../rightBar/RightBar";
import { useDispatch, useSelector } from "react-redux";
import Stomp, { client, over } from 'stompjs';
import { addChat, addFriendAndDeleteResponse, addFriendRequest, addFriendResponse, addMessage, deleteFriendRequestOrResponse, setSub, setView } from "../../../slices/userSlice";
import SockJsClient from 'react-stomp';
import SockJS from "sockjs-client";
import React from 'react';

import './MainPage.scss';
import { set } from "../../../slices/clientSlice";
import { StompSessionProvider } from "react-stomp-hooks";
import useSubscription from "../../hooks/useSubscription";

const MainPage = () => {
    const isInitialMount = useRef(true);
    const dispatch = useDispatch();
    const clientRef = useRef(null);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
         } else {
            const sock = new SockJS('http://localhost:8080/ws');
            clientRef.current = over(sock);
            clientRef.current.connect({}, () => {
                fetch(`http://quhan.site/api/message/getMessagesSubs/${window.localStorage.getItem('id')}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${window.localStorage.getItem('jwt-token')}`
                    }
                })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    data.forEach(elem => {
                        clientRef.current.subscribe(elem, (msg) => dispatch(addMessage({message: JSON.parse(msg.body)})))
                    })
                })

                fetch(`http://quhan.site/api/message/getViewsSubs/${window.localStorage.getItem('id')}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${window.localStorage.getItem('jwt-token')}`
                    }
                })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    data.forEach(elem => {
                        clientRef.current.subscribe(elem, (msg) => dispatch(setView(JSON.parse(msg.body))))
                    })
                })

                clientRef.current.subscribe(`/${window.localStorage.getItem('id')}/chat`, (msg) => {
                    dispatch(addChat(JSON.parse(msg.body)));
                });

                clientRef.current.subscribe(`/${window.localStorage.getItem('id')}/friendRequest`, (msg) => {
                    dispatch(addFriendRequest(JSON.parse(msg.body)));
                });

                clientRef.current.subscribe(`/${window.localStorage.getItem('id')}/friendResponse`, (msg) => {
                    console.log(msg);
                    dispatch(addFriendResponse(JSON.parse(msg.body)));
                });

                clientRef.current.subscribe(`/${window.localStorage.getItem('id')}/acceptFriend`, (msg) => {
                    console.log(msg);
                    dispatch(addFriendAndDeleteResponse(JSON.parse(msg.body)));
                });

                clientRef.current.subscribe(`/${window.localStorage.getItem('id')}/declainFriend`, () => {
                    dispatch(deleteFriendRequestOrResponse());
                });
            });

            // if(isWsOpenRef.current) {
            //     return
            // }
            // clientRef.current = null;

            //  const sock = new SockJS('http://localhost:8080/ws');
            //  clientRef.current = over(sock);
            // console.log(clientRef);

            // clientRef.current.connect({}, () => {
            //     const subs = user.chats.map(elem => {
            //         return `/${elem.id}/view`
            //     })

            //     subs.forEach(sub => {
            //         clientRef.current.subscribe(sub, (msg) => {
            //             const body = JSON.parse(msg.body);
            //             console.log(body.userId);
            //             console.log(window.localStorage.getItem('id'));
            //             console.log(body.userId != window.localStorage.getItem('id'));
            //             if(body.userId != window.localStorage.getItem('id')) {
            //                 dispatch(setView(body));
            //             }
            //         });
            //     })

            //     clientRef.current.subscribe(`/${window.localStorage.getItem('id')}/chat`, (msg) => {
            //         msg = {
            //             ...msg, 
            //             messages: []
            //         }
            //         dispatch(addChat(JSON.parse(msg.body)));
            //     })

            //     const subsMessage = user.chats.map(elem => {
            //             return `/${elem.id}/messages`
            //     })

            //     subsMessage.forEach(sub => {
            //         clientRef.current.subscribe(sub, (msg) => {
            //             console.log(msg);
            //             dispatch(addMessage({
            //                 message: JSON.parse(msg.body),
            //                 activeChat: activeChat.value
            //             }));
            //         })
            //     })
            //     isWsOpenRef.current = true;
            //     dispatch(setSub(true));
            // })
         }
    }, [])

    return(
        <div className="mainPage">
            <LeftBar clientRef={clientRef}/>
            <RightBar clientRef={clientRef}/>
        </div>
    )
}

export default MainPage;
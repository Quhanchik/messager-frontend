import { useDispatch, useSelector } from "react-redux";
import './ChatList.scss';
import { useState } from "react";
import { set } from "../../slices/activeChatSlice";
import SockJsClient from 'react-stomp';
import React from 'react';

const ChatList = () => {
    const user = useSelector(state => state.user);
    const chats = useSelector(state => state.user.chats)
    const activeChat = useSelector(state => state.activeChat);

    const dispatch = useDispatch();

    const items = () => user.chats.map((element, i) => {
        return(
            <div 
                className={`chatList_item`}
                key={element.id} 
                onClick={(e) => {
                    if(activeChat.value != element.id) {
                        dispatch(set(element.id))
                    }
                }}>
                <div className={`${activeChat.value === element.id ? 'chatList_transparantcy_active' : null}`}></div>
                
                <div className="chatList_wrapper">
                    <img src={element.avatar} alt="" className="chatList_img"/>  
                    <div className="chatList_title">{element.title}</div>
                </div>
                <div className="searchList_line"></div>
            </div>
        )
    })

    const subUrls = () => chats.map(item => {
        return `/${item.id}/view`
    })

    return(
        <>
             {/* <SockJsClient url='http://localhost:8080/ws'
                topics={subUrls()}
                onConnect={() => {
                    console.log("connected to view");
                }}
                onDisconnect={() => {
                    console.log("Disconnected");
                }}
                onMessage={(msg) => {

            }}/> */}
            <div className="main_title">Chats</div>
                <div className="chatList">
                    <div className="chatList_mainWrapper">
                     {items()}
                </div>
            </div>
        </>
    )
}

export default ChatList;
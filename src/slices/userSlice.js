import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { log } from "util";

const userSlice = createSlice({
        name: 'user',
        initialState: {
            fullname: '',
            authority: '',
            login: '',
            avatar: '',
            friends: [],
            friendRequests: [],
            chats: [],
            id: -1,
            descr: '',
            isSub: false
        },
        reducers: {
            set: (state, {payload}) => {
                state = {...payload};

                state.chats.forEach(elem => {
                    elem.messages = [];
                    elem.isInit = false;
                    elem.currPage = 0;
                })

                return state;
            },
            setPage: (state, {payload}) => {
            },
            setSub: (state, {payload}) => {
                state.isSub = payload;
            },
            setMessages: (state, {payload}) => {
                
                const res = JSON.parse(JSON.stringify(state.chats.find(elem => elem.id == payload.activeChat)));


                if(res.messages.length > 0) {
                    if(payload.messages.empty ||
                        res.messages[0].number == payload.messages.number) {
                       return
                   }
                }

                payload.messages.content = payload.messages.content.reverse()

                const chat = state.chats.find(elem => elem.id == payload.activeChat);

                chat.currPage = chat.currPage + 1;

                payload.messages.content = [...payload.messages.content];

                chat.messages = [payload.messages, ...chat.messages];
                return state;
            },
            appendMessages: (state, {payload}) => {
                if(payload.messages.content.lenght < 1) {
                    return
                }
                // console.log(payload);
                const chat = state.chats.find(elem => elem.id == payload.activeChat);

                payload.messages.content = {
                    ...payload.messages,
                    content: payload.messages.content.reverse()
                }

                const arr = chat.messages.find(elem => {
                    if(elem.number === payload.messages.number) {
                        return elem;
                    }
                });

                if(JSON.stringify(arr) == null && payload.messages.content.lenght > 0) {
                    chat.messages = [payload.messages, ...chat.messages];
                }

                return state;
            },
            setView: (state, {payload}) => {
                const chat = state.chats.find(elem => elem.id == payload.chatId);
                let msg = null;
                if(chat.messages.length > 0) {
                    chat.messages.forEach(item => {
                        item.content.forEach(elem => {
                            if(elem.id == payload.messageId) {
                                msg = elem;
                            }
                        })
                    })
                }

                if(msg != null) {
                    msg.views = [...msg.views, payload.userId]
                }
            },
            deleteMessage: (state, {payload}) => {
                state.chats.forEach(elem => {
                    elem.messages.forEach(item => {
                        let arr = [];
                        item.content.forEach(msg => {
                            if(msg.id != payload) {
                                arr.push(msg);
                            }
                        })
                        item.content = [...arr];
                    })
                })
            },
            addMessage: (state, {payload}) => {
                console.log(payload);
                if(payload.message.activeChat != payload.message.chat.id) {
                    return
                } 
                payload.message.views = [];
                console.log(payload);
                state.chats.forEach(chat => {
                    if(chat.id == payload.message.chat.id) {
                        if(chat.messages.length > 0) {
                            if(chat.messages[chat.messages.length - 1].content.length > 49) {
                                chat.messages = [...chat.messages,
                                {
                                    content: [payload.message],
                                    empty: false
                                }]
                            } else {
                                chat.messages[chat.messages.length - 1].content = [
                                    ...chat.messages[chat.messages.length - 1].content,
                                    payload.message
                                ]
                            }
                        } else {
                            chat.messages = [
                                {
                                    content: [payload.message],
                                    empty: false
                                }
                            ]
                        }
                    }
                })
            },
            addChat: (state, {payload}) => {
                return {
                    ...state,
                    chats: [...state.chats, payload]
                }
            },
            addFriendRequest: (state, {payload}) => {
                return {
                    ...state,
                    friendRequests : [...state.friendRequests, payload]
                }
            }, 
            addFriendResponse: (state, {payload}) => {
                return {
                    ...state,
                    friendResponses : [...state.friendResponses, payload]
                }
            },
            addFriendAndDeleteResponse: (state, {payload}) => {
                const newFriendRequests = state.friendRequests.filter(item => {
                    if(!item.accepterId.id == window.localStorage.getItem('id')) {
                        return item;
                    }
                })

                const newFriendResponses = state.friendResponses.filter(item => {
                    if(!item.senderId.id == window.localStorage.getItem('id')) {
                        return item;
                    }
                })
 
                const newFriendList = payload.friendId ? (payload.friendId.id == window.localStorage.getItem('id') ? state.friends : [...state.friends, payload]) : state.friends;
                const newFriendList2 = payload.userId ? (payload.userId.id == window.localStorage.getItem('id') ? state.friends : [...state.friends, payload]) : state.friends2;

                return {
                    ...state, 
                    friendRequests: newFriendRequests,
                    friends: newFriendList,
                    friends2: newFriendList2,
                    friendResponses: newFriendResponses
                }
            },
            deleteFriendRequestOrResponse: (state) => {
                const newFriendRequests = state.friendRequests.filter(item => {
                    if(!item.accepterId.id == window.localStorage.getItem('id')) {
                        return item;
                    }
                })

                const newFriendResponses = state.friendResponses.filter(item => {
                    if(!item.senderId.id == window.localStorage.getItem('id')) {
                        return item;
                    }
                })

                return {
                    ...state, 
                    friendRequests: newFriendRequests,
                    friendResponses: newFriendResponses
                }
            },
            addToFriend: (state, {payload}) => {
                const user = state.friendRequests[payload];
                state.friendRequests.pop(user);
                state.friends.push(user);
            },
            addToFriendRequest: (state, {payload}) => {
                state.friendRequests.push(payload);
            }
        }
    })

const {reducer, actions} = userSlice;
export const {set, addChat, addFriendRequest, deleteFriendRequestOrResponse, addFriendAndDeleteResponse, addFriendResponse, setSub, deleteMessage, setPage, setView, appendMessages, addToFriend, addToFriendRequest, setMessages, addMessage} = actions;
export default reducer;


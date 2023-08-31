import { useEffect, useState } from "react";
import './SearchList.scss';

import userPlus from '../../icons/user-plus.png';
import userCheck from '../../icons/user-check.png';
import userSend from '../../icons/user-send.png';
import userX from '../../icons/user-x.png'
import group from '../../icons/group.svg';
import { useSelector } from "react-redux";
import React from 'react';

const SearchList = ({text, clientRef}) => {
    const [people, setPeople] = useState([]);
    const friendRequests = useSelector(state => state.user.friendRequests);
    const friendResponses = useSelector(state => state.user.friendResponses);
    const friendsList = useSelector(state => state.user.friends);
    const friendsList2 = useSelector(state => state.user.friends2);

    useEffect(() => {
        fetch('http://quhan.site/api/user/findPeople', {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                login: text
            })
        }).then(res => {
            if(res.status === 200) {
                res.json().then(data => {
                    setPeople(data);
                })
            }
        })
    }, [text])

    const isRequestSent = (elem) => {
        const request = friendRequests.find(item => {
            if(item.accepterId.id == elem.id) {
                return item;
            }
        })
        
        console.log(request);

        if(request) {
            return true;
        }
        return false;
    }

    const isResponseCome = (elem) => {
        const response = friendResponses.find(item => {
            if(item.senderId.id == elem.id) {
                return item;
            }
        })
        
        console.log(response);

        if(response) {
            return true;
        }
        return false;
    }

    const sendFriend = (elem) => {
        clientRef.current.send('/friendRequest', {}, JSON.stringify({
            senderId: window.localStorage.getItem('id'),
            accepterId: elem.id
        }))
    }

    const acceptFriend = (elem) => {
        clientRef.current.send('/acceptFriend', {}, JSON.stringify({
            senderId: window.localStorage.getItem('id'),
            accepterId: elem.id
        }))
    }

    const declainFriend = (elem) => {
        clientRef.current.send('/declainFriend', {}, JSON.stringify({
            senderId: window.localStorage.getItem('id'),
            accepterId: elem.id
        }))
    }

    const isFriends = (elem) => {
        const list = friendsList.find(item => {
            if(item.friendId.id == elem.id) {
                return item;
            }
        })

        const list2 = friendsList2.find(item => {
            if(item.userId.id == elem.id) {
                return item;
            }
        })

        if(list || list2) {
            return true;
        } else {
            return false;
        }
    }

    const items = (text) => {
        if(people.length < 1) {
            return;
        }
        return people.users.map((element, i) => {
            if(element.id == window.localStorage.getItem('id')) {
                return
            } else {
                return (
                    <div className="searchList_item" key={i}>
                        <div className="searchList_wrapper">
                            <img src={element.avatar} alt="" className="searchList_img"/>
                            <div className="searchList_fullname">{element.fullname}</div>
                            {isRequestSent(element) ?
                                <img src={userSend} alt="" onClick = {() => sendFriend()} className="searchList_icon" />
                                :
                                (isResponseCome(element) ?
                                    <>
                                        <img src={userCheck} alt="" onClick = {() => acceptFriend(element)} className="searchList_icon1" />
                                        <img src={userX} alt="" onClick = {() => declainFriend(element)} className="searchList_icon2" />
                                    </>
                                :
                                (isFriends(element) ?
                                    <img src={group} alt="" className="searchList_icon" />
                                :
                                    <img src={userPlus} alt="" onClick = {() => sendFriend(element)} className="searchList_icon" />
                                ))
                            }
                        </div>
                        <div className="searchList_line"></div>
                    </div>  
                )
            }
        })
    }

    return(
        <div className="searchList">
            <div className="main_title">Founded people</div>
            {items()}
        </div>
    )
}

export default SearchList;
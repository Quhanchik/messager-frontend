import { useSelector } from "react-redux"
import './NewGroup.scss';
import { useState } from "react";
import React from 'react';

const NewGroup = ({clientRef,setIsNewGroup}) => {
    const user= useSelector(state => state.user)
    const [listOfMembers, setListOfMembers] = useState([]);
    const [title, setTitle] = useState('');
    
    const friendsList = () => {
        // console.log(user);
        if(user.friends.lenght < 1) {
            return;
        }
        return user.friends.map(elem => {
            console.log(listOfMembers.includes(elem));
            return (
                <div 
                key={elem.id}
                    className={`newGroup_item ${listOfMembers.includes(elem.friendId) 
                        ? 'newGroup_active' 
                        : null}`} 
                    onClick={() => {
                        if(listOfMembers.includes(elem.friendId)) {
                            listOfMembers.pop(elem.friendId);
                            setListOfMembers([
                                ...listOfMembers
                            ])
                        } else {
                            setListOfMembers([
                                ...listOfMembers,
                                elem.friendId
                            ])
                    }
                }}>
                    <div className="newGroup_wrapper">
                        <img src={elem.friendId.avatar} alt="" className="newGroup_img" />
                        <div className="newGroup_name">{elem.friendId.fullname}</div>
                    </div>
                    {/* <div className="newGroup_line"></div> */}
                </div>
            )
        })
    }

    return (
        <div className="newGroup">
            <form className="newGroup_form" onSubmit={(e) => {
                e.preventDefault();
                if(listOfMembers.length < 1 || title.length < 1) {
                    return
                } else {
                    clientRef.current.send('/chat', {}, JSON.stringify({
                        senderId: window.localStorage.getItem('id'),
                        title: title,
                        members: listOfMembers
                    }));
                    setIsNewGroup(false);
            }}}>
                <input 
                    className="newGroup_input" 
                    type="text" 
                    placeholder="title"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}    
                />
                <div className="newGroup_list">
                    <div className="newGroup_header">Choice the members</div>
                    {friendsList()}
                    <button className="newGroup_btn">submit</button>
                </div>
            </form>
        </div>
    )
}

export default NewGroup
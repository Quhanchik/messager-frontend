import { useSelector } from "react-redux"
import './FriendList.scss';
import userPlus from '../../icons/user-plus.png';
import React from 'react';

const FriendList = () => {
    const user = useSelector(state => state.user);

    const items = user.friends.map(element => {
        return(
            <div className="friendList_item">
                <div className="friendList_wrapper">
                    <img src={user.avatar} alt="" className="friendList_img" />
                    <div className="friendList_fullname">{element.friendId.fullname}</div>
                </div>
                <div className="friendList_line"></div>
            </div>
        )
    })

    return(
        <div className="friendList">
            <div className="main_title">Friends</div>
            {items}
        </div>
    )
}

export default FriendList;
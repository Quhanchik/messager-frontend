import './Menu.scss';
import user from '../../icons/user.png';
import group from '../../icons/group.svg';
import userPlus from '../../icons/user-plus.png';
import React from 'react';

const Menu = ({setIsFriendOpen, setIsOpen, setIsNewGroup, setIsChatList, setIsSearch}) => {
    return(
        <div className="menu">
            <div className="menu_bg"></div>
            <div className="menu_item" onClick={() => {
                setIsChatList(false);
                setIsSearch(false);
                setIsFriendOpen(true);
                setIsOpen(false);
                setIsNewGroup(false);
            }}>
                <img src={user} alt="" className="menu_img" />
                <div className="menu_title">friends</div>
            </div>

            <div className="menu_item" onClick={() => {
                setIsChatList(false);
                setIsSearch(false);
                setIsNewGroup(true);
                setIsFriendOpen(false);
                setIsOpen(false);
            }}>
                <img src={group} alt="" className="menu_img" />
                <div className="menu_title">create group</div>
            </div>

            <div className="menu_item">
                <img src={userPlus} alt="" className="menu_img" />
                <div className="menu_title">friend request</div>
            </div>
        </div>
    )
}

export default Menu;
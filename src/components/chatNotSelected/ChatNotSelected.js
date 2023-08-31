import illustration from '../../img/chatNotSelected.svg';
import React from 'react';
import './ChatNotSelected.scss';

const ChatNotSelected = () => {
    return (
        <div className="chatNotSelected">
            <img className='chatNotSelected_img' src={illustration} alt="" />
            <div className="chatNotSelected_descr">select a chat from the list in left bar</div>
        </div>
    )
}

export default ChatNotSelected;
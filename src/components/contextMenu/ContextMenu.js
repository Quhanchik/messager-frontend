import { useEffect } from 'react';
import './ContextMenu.scss';
import { createPortal } from 'react-dom';
import App from '../../App';
import pen from '../../icons/pen.svg';
import trash from '../../icons/trash.svg';
import { useDispatch } from 'react-redux';
import { deleteMessage } from '../../slices/userSlice';
import React from 'react';

const ContextMenu = ({x, y, views, setIsContextMenu, msgId}) => {

    const dispatch = useDispatch();

    const viewers = () => views.map((elem, i) => {
        if(i > 3) {
            return
        }
        return (
            <div className='contextMenu_viewer'>
                {i != 0 ? <div className="contextMenu_round" style={{'left': `${i * 7 + 10}px`}}></div> : null}
                <img className='contextMenu_avatar' src={elem.avatar} style={{'left': `${i * 8 + 10}px`}} alt="" />
            </div>
        )
    })

    const deleteMsg = () => {
        console.log(msgId);
        fetch(`http://localhost:8080/message/${msgId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem('jwt-token')}`
            }
        }).then((res) => {
            console.log(res);
            dispatch(deleteMessage(msgId));
            setIsContextMenu(false);
        })
    }

    return (
        <div className="contextMenu" style={{'top': `${y - 100}px`, 'left': `${x -50}px`}}>
            <div className="contextMenu_item" onClick={() => deleteMsg()}>
                <img src={trash} alt="" className="contextMenu_icon" />
                <div className="contextMenu_text">delete message</div>
            </div>
            <div className="contextMenu_item">
                {viewers()}
                {views.length > 0 ? <div className='contextMenu_seen'>{`${views.length} seen`}</div> : <div className='contextMenu_text'>0 seen</div>}
                {createPortal(<div className='contextMenu_hidden' onClick={() => setIsContextMenu(false)}></div>, document.querySelector('.mainPage'))}
            </div>
        </div>
    )
}

export default ContextMenu;
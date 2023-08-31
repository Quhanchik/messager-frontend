import './MyMessage.scss';
import group from '../../icons/group.svg';
import check from '../../icons/check.svg';
import doubleCheck from '../../icons/double-check.svg';
import { useEffect, useState } from 'react';
import ContextMenu from '../contextMenu/ContextMenu';
import { Buffer } from "buffer";
import play from '../../icons/play.png'

const MyMessage = (props) => {
    const {msg, setX, setY, setIsContextMenu, setViews, setMsgId, lastMsgIdRef} = props;

    const d = new Date(msg.sentTime);
    const hours = d.getHours().toString().padStart(2, 0);
    const minutes = d.getMinutes().toString().padStart(2, 0);
    const formattedTime = `${hours}:${minutes}`;

    const contextMenu = (e) => {
        e.preventDefault();

        setMsgId(msg.id);

        setIsContextMenu(true);
        setViews(msg.views);

        console.log(e.clientX);
        console.log(e.clientY);

        setX(e.clientX > window.innerWidth - 100 ? window.innerWidth - 100 : e.clientX);
        setY(e.clientY > window.innerHeight - 80 ? window.innerHeight - 80 : e.clientY);
    }

    const toggleVideo = (e) => {
        if(e.classList.contains('play')) {
            e.classList.remove('play');
            e.pause();
        } else {
            e.classList.add('play');
            e.play();

        }
    }

    const videoEnd = (e) => {

        e.currentTarget.currentTime = 0;
        e.currentTarget.pause();
    }

    return (
        <div key={msg.id} className="myMessage">
            {msg.text.startsWith('data:audio/wav') ? 
                <div className="myMessage_fileBubble" onContextMenu={(e) => contextMenu(e)}>
                    <div className="myMessage_fileTextWrapper">
                        <div className="myMessage_sender">{msg.sender.fullname}</div>
                        <div className="myMessage_sentTime">{formattedTime}</div>
                    </div>
                    <audio className='myMessage_audio' controls src={msg.text}></audio>
                    <div className="myMessage_audioMetaWrapper">
                        <img src={msg.views.length > 0 ? doubleCheck : check} alt="" className="myMessage_check" />
                    </div>
                </div>
            : (msg.text.startsWith('data:video/mp4') ?
                <div className="myMessage_videoBubble" onContextMenu={(e) => contextMenu(e)}>
                    <div className="myMessage_fileTextWrapper">
                        <div className="myMessage_sender">{msg.sender.fullname}</div>
                        <div className="myMessage_sentTime">{formattedTime}</div>
                    </div>
                    <div className="myMessage_videoWrapper">
                        <video className='myMessage_video' onEnded={(e) => videoEnd(e)} onClick={(e) => toggleVideo(e.currentTarget)} src={msg.text}></video>
                    </div>
                    <div className="myMessage_audioMetaWrapper">
                        <img src={msg.views.length > 0 ? doubleCheck : check} alt="" className="myMessage_check" />
                    </div>
                </div> :
            (msg.file ?
                <div className="myMessage_fileBubble" onContextMenu={(e) => contextMenu(e)}>
                    <div className="myMessage_fileTextWrapper">
                        <div className="myMessage_sender">{msg.sender.fullname}</div>
                        <div className="myMessage_sentTime">{formattedTime}</div>
                    </div>
                    <img src={msg.text} alt="" className='myMessage_image'/>
                    <div className="myMessage_fileMetaWrapper">
                        <img src={msg.views.length > 0 ? doubleCheck : check} alt="" className="myMessage_check" />
                    </div>
                </div> :
                <div className="myMessage_fileBubble" onContextMenu={(e) => contextMenu(e)}>
                    <div className="myMessage_fileTextWrapper">
                        <div className="myMessage_sender">{msg.sender.fullname}</div>
                        <div className="myMessage_sentTime">{formattedTime}</div>
                    </div>
                    <div className="myMessage_metaWrapper">
                    <div className="myMessage_text">{msg.text}</div>
                        <img src={msg.views.length > 0 ? doubleCheck : check} alt="" className="myMessage_check" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MyMessage;
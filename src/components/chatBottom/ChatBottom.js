import './ChatBottom.scss';

import paperclipper from '../../icons/paperclip.svg';
import smile from '../../icons/smile.svg';

import SockJS from 'sockjs-client';
import Stomp, { over } from 'stompjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SockJsClient from 'react-stomp';
import { addMessage } from '../../slices/userSlice';
import { useReactMediaRecorder } from 'react-media-recorder';
import useSubscription from '../hooks/useSubscription';
import AudioRecorder from '../audioRecorder/AudioRecorder';
import VideoRecorder from '../videoRecorder/VideoRecorder';

const ChatBottom = ({clientRef}) => {
    const activeChat = useSelector(state => state.activeChat);
    const dispatch = useDispatch();
    const [connected, setConnected] = useState(false);
    // const clientRef = useRef();
    const isInitialMount = useRef(true);
    const chats = useSelector(state => state.user.chats);
    const [isVideo, setIsVideo] = useState(true);

    // const sock = new SockJS('http://localhost:8080/ws');
    // const client = over(sock);


    const [text, setText] = useState('');
    // client.current.connect({}, () => {
    //     setConnected(true);
    // });

    //  useEffect(() => {
    //     if (isInitialMount.current) {
    //         isInitialMount.current = false;
    //      } else {
    //          connect();
    //      }
    // }, [])

    const sendMessage = (e) => {
        e.preventDefault();
        setText('');

        // if(connected && client.current.connected && text != '') {
        //     client.current.send(`/chat`, {}, JSON.stringify({
        //         sender: window.localStorage.getItem('id'),
        //         chatId: activeChat,
        //         text
        //     }))
        // }
        if(text != '') {
            console.log('send');
            clientRef.current.send('/message', {}, JSON.stringify({
                sender: window.localStorage.getItem('id'),
                chatId: activeChat.value,
                isFile: false,
                text,
                activeChat: activeChat.value
            }));
        }
    }

    const sendFile = (e) => {
        const file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            clientRef.current.send('/message', {}, JSON.stringify({
            sender: window.localStorage.getItem('id'),
            chatId: activeChat.value,
            file: true,
            text: reader.result,
            activeChat: activeChat.value
        }));
        };
        // clientRef.current.sendMessage('/message', JSON.stringify({
        //     sender: window.localStorage.getItem('id'),
        //     chatId: activeChat.value,
        //     isFile: true,
        //     text
        // }));
    }

   
    return (
        <div className="chatBottom">
            <form className='chatBottom_fileForm'>
                <img className='chatBottom_icon chatBottom_paperclipper' src={paperclipper} alt=""/>
                <input className='chatBottom_file' type="file" onChangeCapture={(e) => sendFile(e)}/>
            </form>
            <form  
                className='chatBottom_form'
                onSubmit={(e) => sendMessage(e)}>
                <input
                    type="text" 
                    className='chatBottom_input' 
                    placeholder='write here...'
                    value={text}
                    onChange={(e) => setText(e.currentTarget.value)}/>
            </form>
            <VideoRecorder clientRef={clientRef} activeChat={activeChat}/>
            <AudioRecorder clientRef={clientRef} activeChat={activeChat}/>
        </div>
    )
}

export default ChatBottom;
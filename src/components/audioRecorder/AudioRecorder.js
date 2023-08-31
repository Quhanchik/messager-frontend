import { useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import React from 'react';

import mic from '../../icons/mic.svg';

const AudioRecorder = ({clientRef, activeChat}) => {
    const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({audio: true});

    useEffect(() => {
        if(!clientRef || mediaBlobUrl == null) {
            return
        }
        const reader = new FileReader();
        fetch(mediaBlobUrl).then(r => r.blob())
        .then(res => {
            reader.readAsDataURL(res);
        });
        reader.onloadend = () => {
            clientRef.current.send('/message', {}, JSON.stringify({
                sender: window.localStorage.getItem('id'),
                chatId: activeChat.value,
                file: true,
                text: reader.result
            }));
        }
        // var reader = new FileReader();
        // reader.readAsDataURL(mediaBlobUrl);
        // reader.onload = function () {
        //     clientRef.current.sendMessage('/message', JSON.stringify({
        //     sender: window.localStorage.getItem('id'),
        //     chatId: activeChat.value,
        //     file: true,
        //     text: reader.result
        // }));
        // };
    }, [mediaBlobUrl])

    const startAudio = () => {
        startRecording();

        document.querySelector('.chatBottom_mic').classList.add('chatBottom_hold');
    }

    const stopAudio = () => {
        stopRecording();

        document.querySelector('.chatBottom_mic').classList.remove('chatBottom_hold');
    }


    return(
        <img className='chatBottom_icon chatBottom_mic' onMouseDown={() => startAudio()} onMouseUp={() => stopAudio()} src={mic} alt=""/>
    )
}

export default AudioRecorder;
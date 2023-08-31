import './OtherMessage.scss';
import group from '../../icons/group.svg';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useSelector } from 'react-redux';
import play from '../../icons/play.png'

const OtherMessage = (props) => {
    const {msg, clientRef} = props;


    const d = new Date(msg.sentTime);
    const hours = d.getHours().toString().padStart(2, 0);
    const minutes = d.getMinutes().toString().padStart(2, 0);
    const formattedTime = `${hours}:${minutes}`;

    const cbRef = useIntersectionObserver({ threshold: 0 }, (entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                if(clientRef.current == null) {
                    return
                }
                clientRef.current.send('/view', {}, JSON.stringify({
                    message: entry.target.classList[1],
                    user: window.localStorage.getItem('id')
                }))
            }
        })
    })

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
        <div key={msg.id} className={`otherMessage ${msg.id}`} ref={cbRef}>
            {msg.text.startsWith('data:audio/wav') ? 
                <div className="myMessage_fileBubble">
                    <div className="myMessage_fileTextWrapper">
                        <div className="myMessage_sender">{msg.sender.fullname}</div>
                        <div className="myMessage_sentTime">{formattedTime}</div>
                    </div>
                    <audio className='myMessage_audio' controls src={msg.text}></audio>
                </div>
            : (msg.text.startsWith('data:video/mp4') ?
            <div className="myMessage_videoBubble">
                <div className="myMessage_fileTextWrapper">
                    <div className="myMessage_sender">{msg.sender.fullname}</div>
                    <div className="myMessage_sentTime">{formattedTime}</div>
                </div>
                <div className="myMessage_videoWrapper">
                    <video className='myMessage_video' onEnded={(e) => videoEnd(e)} onClick={(e) => toggleVideo(e.currentTarget)} src={msg.text}></video>
                </div>
            </div> :
             (msg.file ?
                <div className="otherMessage_fileBubble">
                    <div className="otherMessage_fileTextWrapper">
                        <div className="otherMessage_sender">{msg.sender.fullname}</div>
                        <div className="otherMessage_sentTime">{formattedTime}</div>
                    </div>
                    <img src={msg.text} alt="" className='otherMessage_image'/>
                </div> :
                <div className="otherMessage_fileBubble">
                    <div className="otherMessage_fileTextWrapper">
                        <div className="otherMessage_sender">{msg.sender.fullname}</div>
                        <div className="otherMessage_sentTime">{formattedTime}</div>
                    </div>
                    <div className="otherMessage_metaWrapper">
                    <div className="otherMessage_text">{msg.text}</div>
                    </div>
                </div>
             ))}
        </div>
    )
}

export default OtherMessage;
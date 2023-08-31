import { useDispatch, useSelector } from "react-redux";
import ChatNotSelected from "../chatNotSelected/ChatNotSelected";
import Chat from "../chat/Chat";
import './RightBar.scss';
import { useEffect } from "react";
import { useSubscription } from "react-stomp-hooks";
import { addMessage } from "../../slices/userSlice";

const RightBar = ({clientRef}) => {
    const activeChat = useSelector(state => state.activeChat);
    return(
        <div className="rightBar">
            {activeChat.value === -1 ? <ChatNotSelected/> : <Chat clientRef={clientRef}/>}
        </div>
    )
}

export default RightBar;
import emptyChatIllustration from '../../icons/emptyChat.svg';
import './EmptyChatError.scss';
import React from 'react';

const EmptyChatError = () => {
    return (
        <div className="emptyChatError">
            <img src={emptyChatIllustration} alt="" className="emptyChatError_illustration" />
            <div className="emptyChatError_text">This chat doesn't have messages yet</div>
        </div>
    )
}

export default EmptyChatError;
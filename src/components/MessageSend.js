import React from 'react'

function MessageSend({
    title = '-----',
    time = "- : - ::"
}) {
    return (
        <div className="chat-row">
            <div className="message sent">
                <p>{title}</p>
                <span className='time'>{time}</span>
            </div>
        </div>
    )
}

export default MessageSend
import React from 'react'

function MessageReceived({
    title = '---',
    time = "- : - ::"
}) {
    return (
        <div className="chat-row">
            <div className="message received">
                <p>{title}</p>
                <span className='time'>{time}</span>
            </div>
        </div>
    )
}

export default MessageReceived
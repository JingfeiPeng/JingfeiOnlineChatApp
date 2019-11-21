import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

import './ShowChatRoomMembers.css'

const ShowChatRoomMembers =  ({users}) => (
    <ScrollToBottom className="messages">
        {users.map(({name}, index) =>(
            <div key={index}>
                <p>{name} </p>
            </div>
        ))}
    </ScrollToBottom>
)

export default ShowChatRoomMembers;
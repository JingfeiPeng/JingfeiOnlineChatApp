import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'

import InfoBar from '../InfoBar/InfoBar'
import UserInput from '../UserInput/UserInput'
import Messages from '../Messages/Messages'
import ShowChatRoomMembers from '../ShowChatRoomMembers/ShowChatRoomMembers'

import './Chat.css'

let socket;

const Chat = ({location}) =>{
    const [name, setName] = useState('') // '' as the initial value for name, and setName is the setter
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('') // message to send from myself
    const [messages, setMessages] = useState([]) // all the messages from everyone
    const [users, setUsers] = useState([]);
    const ENDPOINT = "https://jingfei-chat-app.herokuapp.com";

    useEffect(()=>{
        // called when component renders
        const {room, name} = queryString.parse(location.search)
        setName(name)
        setRoom(room)

        socket = io(ENDPOINT)
        socket.emit('join', { name, room}, (res)=>{ // callback specified in backend
            // error catching

            if (res && res.users) {
                console.log("got user data")
                setUsers(users)
            };
        })

        return ()=>{ // function called when component unmount
            socket.emit('disconnect'); 
            socket.off(); // turn the instance of client socket off
        }
        
    }, [ENDPOINT, location.search] // fire useEffect only when these 2 values change
    )

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages, message]);
        })
    }, [messages]) // run this use effect only when messages changes
    

    // function to send messages
    const sendMessage = (event) =>{
        event.preventDefault();

        if (message) {
            // backend sends to the whole room 
            socket.emit("sendMessage", message, () => setMessage('')) // reset the message on client side
        }
    }

    // console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <UserInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            {/* <div className="showMembers">
                <ShowChatRoomMembers users={users} />
            </div> */}
        </div>
    )
}

export default Chat;
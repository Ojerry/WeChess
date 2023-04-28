import React, { useEffect, useState } from 'react'
import './Chat.css'
import ScrollToBottom from 'react-scroll-to-bottom'
import ReactEmoji from 'react-emoji'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '../feature/userInfo/userInfoSlice'
const socket = require('../connection/socket').socket

const Chat = ({gameId, userName}) => {
  const [name, setName] = useState(userName)
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
        });
    },[])

    const sendMessage = (e) => {
        e.preventDefault();
        if(message){
            socket.emit('sendMessage', {name, message, gameId}, () => setMessage(''));
        }
    }

  return (
    <div className='outerContainer'>
        <div className='container'>
            {/* Header */}
            <div className="infoBar">
                <div className="leftInnerContainer">
                    <img className="onlineIcon" src="assets/onlineIcon.png" alt="online icon" />
                    {/* <h3>{room}</h3> */}
                </div>
                <div className="rightInnerContainer">
                    <a href=""><img src="assets/closeIcon.png" alt="close icon" /></a>
                </div>
            </div>
            {/* Messages */}
            <ScrollToBottom  className="messages">
            {console.log(messages)}
                {/* message */}
                {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
            </ScrollToBottom>
            {/* Input */}
            <form className="form">
                <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                />
                <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
            </form>
        </div>
    </div>
  )
}



const Message = ({message: { text, user }, name}) => {
    let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

export default Chat
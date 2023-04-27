import React, { useState } from 'react'
import './Home.css'
import Header from '../component/Header'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { selectUserInfo, setUserInfo } from '../feature/userInfo/userInfoSlice'
import {v4 as uuid} from 'uuid'
import { useSelector } from 'react-redux'
// import { socket } from '../connection/socket'
const socket = require('../connection/socket').socket

const ChooseName = () => {
    const navigate = useNavigate()
    const dispatch =  useDispatch()
    const {redirectedHere} = useSelector(selectUserInfo)
    const [userName, setUserName] = useState('')
    var roomId = ''

    const generateRoom = () => {
        roomId = uuid()
        if(userName === ''){
            const randomNumber = Math.floor(Math.random() * 78932170)
            setUserName("guest" + randomNumber)
            dispatch(setUserInfo({userName: "guest" + randomNumber, redirectedHere: false, roomCreator: true}))
        } else {
            dispatch(setUserInfo({userName: userName, redirectedHere: false, roomCreator: true}))
        }
        const idData = {
            gameId: roomId,
            userName: userName,
            isCreator: true
        }
        
        socket.emit("createNewGame", roomId)
        // socket.emit("playerJoinGame", idData)
        navigate('/'+roomId)
    }

  return (
    <div className='choosename'>
        <Header />
        <div className='typename-div'>
            <div>
                <label>Type Username: </label>
                <input value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            
            <button onClick={() => generateRoom()}>{redirectedHere ? "Continue" : "Create Game"}</button>
        </div>
        
    </div>
  )
}

export default ChooseName
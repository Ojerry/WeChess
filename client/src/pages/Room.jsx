import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo, setUserInfo } from '../feature/userInfo/userInfoSlice'
import { useParams } from 'react-router-dom'
import ChessGame from '../wechess/ui/chessgameui'
const socket = require('../connection/socket').socket

const Room = (props) => {
    const {roomId} = useParams()
    const {userName, redirectedHere, roomCreator} = useSelector(selectUserInfo)
    const secondPlayer = userName === '' && roomCreator === false
    console.log(userName, redirectedHere, roomCreator)
    // const [copied, setCopied] = useState(false)
    useEffect(() => {

      if(!secondPlayer){
        const idData = {
            gameId: roomId,
            userName: userName,
            isCreator: true
        }
        socket.emit("playerJoinGame", idData)
      }
    },[])

    // const copyText = () => {
    //   setCopied(true)
    //   setTimeout(() => {
    //     setCopied(false)
    //   }, 4000)
    //   const text = "localhost:3000/"+roomId
    //   navigator.clipboard.writeText(text);
    // }
  return (
    <div className='room'>
        <Header />
        { secondPlayer ?
          (
            <GetSecondUser />
          ) :(
            <ChessGame myUserName={userName} color={!redirectedHere} />
          )
        }
    </div>
  )
}

const GetSecondUser = () => {
  const [userName, setUserName] = useState('')
  const dispatch = useDispatch()
  const {roomId} = useParams()

  useEffect(() => {
    dispatch(setUserInfo({userName: "", redirectedHere: true, roomCreator: false}))
  },[])

  const fillInfo = () => {
    const idData = {
        gameId : roomId,
        userName : userName,
        isCreator: false
    }
      if(userName === ''){
        const randomNumber = Math.floor(Math.random() * 78932170)
        idData.userName = "guest" + randomNumber
        console.log(idData)
        dispatch(setUserInfo({userName: "guest" + randomNumber, redirectedHere: true, roomCreator: false}))
      } else {
        dispatch(setUserInfo({userName: userName, redirectedHere: true, roomCreator: false}))
      }
      
    socket.emit("playerJoinGame", idData)
  }
  return (
    <div>
      <div className='typename-div'>
            <div>
                <label>Type Username: </label>
                <input value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            
            <button onClick={() => fillInfo()}>Continue</button>
        </div>
    </div>
  )
}

export default Room
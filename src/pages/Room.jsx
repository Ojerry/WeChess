import React from 'react'
import Header from '../component/Header'
import {v4 as uuid} from 'uuid'

const Room = () => {
    const roomId = uuid()
  return (
    <div className='room'>
        <Header />
        <div>
            <p>New game created... Share Below Link to Friend</p>
            <input value={`localhost:3000/game/${roomId}`}/><button>Copy</button>
        </div>
    </div>
  )
}

export default Room
import React from 'react'
import Header from '../component/Header'
import { useSelector } from 'react-redux'
import { selectBoardSize } from '../feature/board/boardSlice'
import './Home.css'


const Home = () => {
    const boardSize = useSelector(selectBoardSize)
  return (
    <div className='home'>
        <Header />
        <div style={{display:"flex", alignItems: "center"}}>
            <div style={{width:`${boardSize.size}px`, height:`${boardSize.size}px`}}>
                <img  src='assets\images\CompleteBoard.jpeg' alt='' style={{width:`${boardSize.size}px`, height:`${boardSize.size}px`}} />
            </div>
            <div className='right-div'>
                <p>Welcome to WeChess</p>
                <button>Play as Guest</button>
                <button>LogIn</button>
                <p>Or</p>
                <button>Sign Up</button>
            </div>
        </div>
            
    </div>
  )
}

export default Home
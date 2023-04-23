import React from 'react'
import './Home.css'
import Header from '../component/Header'

const ChooseName = () => {

    const generateRoom = () => {
        
    }

  return (
    <div className='choosename'>
        <Header />
        <div className='typename-div'>
            <div>
                <label>Type Username: </label>
                <input  />  
            </div>
            
            <button>Continue</button>
        </div>
        
    </div>
  )
}

export default ChooseName
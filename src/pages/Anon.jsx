import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Anon = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/game/kdakhdka")
    },[])
  return (
    <div>
    </div>
  )
}

export default Anon
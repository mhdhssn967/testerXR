import React from 'react'
import './VRDevice.css'
import { registerDevice } from './services/registerDevice'

const VRDevice = () => {

    const deviceId='edfk3455309sdznswerp00234'

    const handleRegisteration=async(bool)=>{
        await registerDevice(deviceId,bool)
    }
  return (
    <>
    <div className='VR-container'>
        <h1>Welcome to Happy Moves</h1>
        <h2>Register your device to continue</h2>
        <h2>Device Id - {deviceId}</h2>
        <button onClick={()=>handleRegisteration(true)}>Register Device</button>
        <button onClick={()=>handleRegisteration(false)}>Set False</button>
    </div>
    </>
  )
}

export default VRDevice
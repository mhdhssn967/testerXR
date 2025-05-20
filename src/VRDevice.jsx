import React, { useState } from 'react'
import './VRDevice.css'
import { registerDevice, useAccessRequestStatus } from './services/registerDevice'

const VRDevice = () => {

    const deviceId='edfk3455309sdznswerp00234'
    

    const handleRegisteration=async(bool)=>{
        await registerDevice(deviceId,bool)
    }

    const authRequest = useAccessRequestStatus(); 
    console.log(authRequest);

    
  return (
    <>
    <div className='VR-container'>
        <h1>Welcome to Happy Moves</h1>
        <h2>Register your device to continue</h2>
        <h2>Device Id - {deviceId}</h2>
        {authRequest?
          <button onClick={()=>handleRegisteration(true)}>Register Device</button>:
          <button>Registering Device <i className="fa-solid fa-spinner"></i></button>
          }
        <button onClick={()=>handleRegisteration(false)}>Set False</button>
    </div>
    </>
  )
}

export default VRDevice
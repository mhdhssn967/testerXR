import React, { useState } from 'react'
import './VRDevice.css'
import { registerDevice, setCredentialsFalse, useAccessRequestCredentialsStatus, useAccessRequestStatus } from './services/registerDevice'

const VRDevice = () => {

    const deviceId='edfk3455309sdznswerp00234'
    

    const handleRegisteration=async()=>{
        await registerDevice(deviceId,true)
    }
    const handleRegisterationFalse=async()=>{
      await registerDevice(deviceId,false)
      await setCredentialsFalse()
    }

    const authRequest = useAccessRequestStatus(); 
    const credentialsExist = useAccessRequestCredentialsStatus();    

    
  return (
    <>
    <div className='VR-container'>
        <h1>Welcome to Happy Moves</h1>
        <h2>Register your device to continue</h2>
        <h2>Device Id - {deviceId}</h2>
        {authRequest?
          <button onClick={handleRegisteration}>Register Device</button>:
          <button>Registering Device <i className="fa-solid fa-spinner"></i></button>
          }
        <button onClick={handleRegisterationFalse}>Set False</button>
    </div>
    </>
  )
}

export default VRDevice
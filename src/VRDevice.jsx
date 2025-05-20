import React, { useEffect, useState } from 'react'
import './VRDevice.css'
import { loginUser, registerDevice, setCredentialsFalse, useAccessRequestCredentialsStatus, useAccessRequestStatus } from './services/registerDevice'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'


const VRDevice = () => {

    const deviceId='edfk3455309sdznswerp00234' //Mock device id
    const navigate = useNavigate()
    

    const handleRegisteration=async()=>{
        await registerDevice(deviceId,true)
    }
    const handleRegisterationFalse=async()=>{
      await registerDevice(deviceId,false)
      await setCredentialsFalse()
    }

    const authRequest = useAccessRequestStatus(); 
    const credentialsExist = useAccessRequestCredentialsStatus();
      

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const docRef = doc(db, "device_request", deviceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { email, password } = docSnap.data();
      if (!email || !password) {
        console.log("Email or password missing in Firestore document.");
        return;
      }

      await loginUser(email, password);
      navigate('/home'); // redirect on success
    } else {
      console.log("No device request found.");
    }
  } catch (err) {
    console.log("Login failed:", err.message);
  }
};
    

  return (
    <>
    <div className='VR-container'>
        <h1>Welcome to Happy Moves</h1>
        <h2>Register your device to continue</h2>
        <h2>Device Id - {deviceId}</h2>
        {!authRequest?
          <button onClick={handleRegisteration}>Register Device</button>:
          <button>Registering Device <i className="fa-solid fa-spinner"></i></button>
          }
        <button onClick={handleRegisterationFalse}>Set False</button>
        {credentialsExist&&<button className='login-btn' onClick={handleLogin}>Login</button>}
    </div>
    </>
  )
}

export default VRDevice
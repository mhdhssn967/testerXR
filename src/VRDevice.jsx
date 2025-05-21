import React, { useEffect, useState } from 'react'
import './VRDevice.css'
import { addDeviceIdToHospital, checkDeviceCountLimit, loginUser, registerDevice, setCredentialsFalse, useAccessRequestCredentialsStatus, useAccessRequestStatus } from './services/registerDevice'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { getAuth, signOut } from 'firebase/auth'
import Swal from 'sweetalert2';


const VRDevice = () => {

  const deviceId = 'edfk3455309jhvh' //Mock device id
  const navigate = useNavigate()


  const handleRegisteration = async () => {
    await registerDevice(deviceId, true)
  }
  const handleRegisterationFalse = async () => {
    await registerDevice(deviceId, false)
    await setCredentialsFalse()
  }

  const authRequest = useAccessRequestStatus();
  const credentialsExist = useAccessRequestCredentialsStatus();
  console.log('credentialexist?', credentialsExist);



  const handleLogin = async (e) => {
    handleRegisterationFalse()
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

  useEffect(() => {
    const loginWithoutNavigate = async () => {
      if (credentialsExist) {
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
            const deviceCountLength = await checkDeviceCountLimit();
            if (deviceCountLength) {
              await addDeviceIdToHospital(deviceId);
              Swal.fire({
                icon: 'success',
                title: 'Registration Success',
                text: 'Logging you in...',
                timer: 2000,
                showConfirmButton: false,
              });
              navigate('/home');
              handleRegisterationFalse()
            } else {
              const auth = getAuth();
              await signOut(auth); // ⬅️ Log the user out
              Swal.fire({
                icon: 'error',
                title: 'Device Limit Exceeded',
                text: 'You cannot register more devices.',
              });
              handleRegisterationFalse()
            }

          } else {
            console.log("No device request found.");
          }
        } catch (err) {
          console.log("Login failed:", err.message);
        }
      }
    }; loginWithoutNavigate()
  }, [credentialsExist])


  return (
    <>
      <div className='VR-container'>
        <h1>Welcome to Happy Moves</h1>
        <h2>Register your device to continue</h2>
        <h2>Device Id - {deviceId}</h2>
        {
          !authRequest ?
            <button onClick={handleRegisteration}>Register Device</button> :
            <button>Registering Device <i className="fa-solid fa-spinner"></i></button>
}
        {/* {(credentialsExist && deviceCountLength) &&
          <div>
            <h2 style={{ color: 'rgb(4, 173, 4)' }}><i style={{ color: 'rgb(4, 173, 4)' }} className="fa-solid fa-circle-check"></i> Device is succesfully registered</h2>
            <button className='login-btn' onClick={handleLogin}>Login</button>
          </div>} */}
      </div>
    </>
  )
}

export default VRDevice
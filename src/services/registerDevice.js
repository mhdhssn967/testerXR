import { getFirestore, doc, setDoc, getDoc, updateDoc, query,onSnapshot, where, getDocs, collection, deleteDoc, arrayUnion } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



export const registerDevice = async (deviceId, bool) => {
  try {


    // Step 1: Get the only document in 'access_request'
    const querySnapshot = await getDocs(collection(db, "access_request"));

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;

      // Step 2: Update that document's request_status and timestamp
      await updateDoc(docRef, {
        request_status: bool,
        timestamp: serverTimestamp()
      });
    } else {
      console.warn("No document found in 'access_request'.");
    }

    const deviceDocRef = doc(db, "device_request", deviceId);

    // Step 3: If bool is true, create/update the device_request doc
    if (bool) {
      await setDoc(deviceDocRef, {
        status: "active",
        timestamp: serverTimestamp(),
        deviceId: deviceId
      });
    } else {
      // Step 4: If bool is false, delete the device_request doc
      await deleteDoc(deviceDocRef);
    }

    console.log("Device registration process completed.");
  } catch (error) {
    console.error("Error registering device: ", error);
  }
};;




export const useAccessRequestStatus = () => {
  const [isRequestActive, setIsRequestActive] = useState(false);

  useEffect(() => {
    const accessRequestRef = collection(db, "access_request");

    // ✅ Query for request_status == true
    const q = query(accessRequestRef, where("request_status", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsRequestActive(!snapshot.empty); // true if found
    });

    return () => unsubscribe();
  }, []);

  return isRequestActive;
};

export const useAccessRequestCredentialsStatus = () => {
  const [isCredentials, setIsCredentials] = useState(false);

  useEffect(() => {
    const accessRequestRef = collection(db, "access_request");

    // ✅ Query for credentials_exist == true
    const q = query(accessRequestRef, where("credentials_exist", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsCredentials(!snapshot.empty); // true if found
    });

    return () => unsubscribe();
  }, []);

  return isCredentials;
};



export const setCredentialsFalse=async()=>{
  const querySnapshotCredentials = await getDocs(collection(db, "access_request"));

    if (!querySnapshotCredentials.empty) {
      const firstDoc = querySnapshotCredentials.docs[0];
      const docRef = doc(db, "access_request", firstDoc.id);

      // set credentials exist false
      await updateDoc(docRef, {
        credentials_exist:false
      });
    }
    
}


// Login user

export const loginUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // success
  } catch (error) {
    throw error; // to be caught in the component
  }
};


// Test device length


export const checkDeviceCountLimit = async () => {
  const auth = getAuth();
  const userId = auth.currentUser;

  try {
    // Step 1: Get VRDeviceCount from hospitalData/userId
    const hospitalDataRef = doc(db, "hospitalData", userId.uid);
    
    const hospitalDataSnap = await getDoc(hospitalDataRef);

    if (!hospitalDataSnap.exists()) {
      console.error("No hospitalData found for user:", userId.uid);
      return false;
    }

    const VRDeviceCount = hospitalDataSnap.data().VRDeviceCount;

    // Step 2: Get deviceids array from hospitals/userId.uid
    const hospitalsRef = doc(db, "hospitals", userId.uid);
    const hospitalsSnap = await getDoc(hospitalsRef);

    if (!hospitalsSnap.exists()) {
      console.error("No hospitals entry found for user:", userId.uid);
      return false;
    }
    
    const deviceIds = hospitalsSnap.data().deviceIds || [];
    

    // Step 3: Compare lengths
    return deviceIds.length < VRDeviceCount;
  } catch (error) {
    console.error("Error checking device count:", error);
    return false;
  }
};



export const addDeviceIdToHospital = async (deviceId) => {
  const auth = getAuth();
  const userId = auth.currentUser;
  try {
    const hospitalRef = doc(db, "hospitals", userId.uid);

    await updateDoc(hospitalRef, {
      deviceIds: arrayUnion(deviceId)
    });

    console.log(`Device ID ${deviceId} added to hospitals/${userId.uid}/deviceIds`);
  } catch (error) {
    console.error("Error adding device ID:", error);
  }
};

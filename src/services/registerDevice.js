import { getFirestore, doc, setDoc, getDoc, updateDoc, query,onSnapshot, where, getDocs, collection, deleteDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from 'react';


export const registerDevice = async (deviceId, bool) => {
  try {
    const db = getFirestore();

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


const firestore = getFirestore();

export const useAccessRequestStatus = () => {
  const [isRequestActive, setIsRequestActive] = useState(false);

  useEffect(() => {
    const accessRequestRef = collection(firestore, "access_request");
    const q = query(accessRequestRef, where("request_status", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIsRequestActive(true);
      } else {
        setIsRequestActive(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return isRequestActive;
};
import { getFirestore, doc, setDoc, getDoc, updateDoc, query,onSnapshot, where, getDocs, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from 'react';



export const registerDevice = async (deviceId, bool) => {
  try {
    const db = getFirestore();

    // Step 1: Get the only document in 'access_request'
    const querySnapshot = await getDocs(collection(db, "access_request"));

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;

      // Step 2: Update that document's request_status
      await updateDoc(docRef, {
        request_status: bool,
        timestamp: serverTimestamp()
      });
    } else {
      console.warn("No document found in 'access_request'.");
    }

    // Step 3: Create/update a device-specific document in 'device_request'
    await setDoc(doc(db, "device_request", deviceId), {
      status: "active",
      timestamp: serverTimestamp(),
      deviceId: deviceId
    });

    console.log("Device registered successfully.");
  } catch (error) {
    console.error("Error registering device: ", error);
  }
};


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
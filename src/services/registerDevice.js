import { getFirestore, doc, setDoc, getDoc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";


export const registerDevice = async (deviceId,bool) => {
  try {
    const db = getFirestore();

    // Query to find the document with request_status: false
    const q = query(
      collection(db, "access_request"),
      where("request_status", "in", [true, false])
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first document with request_status: false
      const docRef = querySnapshot.docs[0].ref;
      
      // Update that document to set request_status to true
      await updateDoc(docRef, {
        request_status: bool,
      });
    } else {
      console.log("No document with request_status: false found.");
    }

    // Proceed with setting the new document for this deviceId
    await setDoc(doc(db, "device_request", deviceId), {
      status: "active",
      timestamp: serverTimestamp(),
      deviceId: deviceId
    });

  } catch (error) {
    console.error("Error registering device: ", error);
  }
};

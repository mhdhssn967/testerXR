import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"

/**
 * Registers a device by setting its status to "active" in Firestore.
 * Assumes Firebase has already been initialized elsewhere.
 *
 * @param {string} deviceId - Unique device ID to register
 * @returns {Promise<void>}
 */
export const registerDevice = async (deviceId) => {
  try {
    const db = getFirestore();

    await setDoc(doc(db, "auth_requests", deviceId), {
      status: "active",
      timestamp: serverTimestamp(),
      deviceId: deviceId
    });

    console.log(`✅ Device ${deviceId} marked as active.`);
  } catch (err) {
    console.error("🔥 Error registering device:", err);
    throw err;
  }
};

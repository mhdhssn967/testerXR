import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // adjust the path if needed

// Initialize Firebase App (only once)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Home = () => {
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUid(user.uid);

      const fetchUserName = async () => {
        try {
          const docRef = doc(db, 'hospitalData', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setName(docSnap.data().name);
          } else {
            console.log('No such document in hospitalData');
          }
        } catch (err) {
          console.error('Error fetching user name:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserName();
    } else {
      console.warn('No user is logged in');
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h2>Successfully Logged In</h2>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <>
          <p><strong>User ID:</strong> {uid}</p>
          <p><strong>Name:</strong> {name || 'Name not found'}</p>
        </>
      )}
    </div>
  );
};

export default Home;

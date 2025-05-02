// Tester.jsx
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // adjust path as needed

const Tester = () => {
  const [position, setPosition] = useState({ x: 0, y: 1, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0, w: 1 });

  const updateFirestore = (newPosition, newRotation) => {
    const dataToUpdate = {
      position: newPosition,
      rotation: newRotation,
    };

    setDoc(doc(db, 'mockData', '1'), dataToUpdate, { merge: true });
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: parseFloat(value) };
    setPosition(newPosition);
    updateFirestore(newPosition, rotation);
  };

  const handleRotationChange = (axis, value) => {
    const newRotation = { ...rotation, [axis]: parseFloat(value) };
    setRotation(newRotation);
    updateFirestore(position, newRotation);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Cube Position & Rotation</h2>

      <h3>Position</h3>
      {['x', 'y', 'z'].map(axis => (
        <div key={axis} style={{ marginBottom: 10 }}>
          <label>{axis.toUpperCase()}: </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={position[axis]}
            onChange={e => handlePositionChange(axis, e.target.value)}
          />
          <span style={{ marginLeft: 10 }}>{position[axis]}</span>
        </div>
      ))}

      <h3>Rotation (Quaternion)</h3>
      {['x', 'y', 'z', 'w'].map(axis => (
        <div key={axis} style={{ marginBottom: 10 }}>
          <label>{axis.toUpperCase()}: </label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={rotation[axis]}
            onChange={e => handleRotationChange(axis, e.target.value)}
          />
          <span style={{ marginLeft: 10 }}>{rotation[axis]}</span>
        </div>
      ))}
    </div>
  );
};

export default Tester;

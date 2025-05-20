import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VRDevice from './VRDevice';
import Home from './Home'; // create this component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VRDevice />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

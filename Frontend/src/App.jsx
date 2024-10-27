import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResuMatic from './pages/ResuMatic'

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResuMatic />} />
      </Routes>
    </Router>
  );
}

export default App;

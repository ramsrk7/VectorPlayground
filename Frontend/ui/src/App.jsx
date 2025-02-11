//src/App.jsx

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import NaiveRag from "./pages/NaiveRag";

import './css/style.css';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return null; // This component doesn't render anything
}

function App() {
  return (
 <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/naiverag" element={<NaiveRag />} />
      </Routes>
</>
  );
}

export default App;

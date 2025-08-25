import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BrigunaPage4K7B9 from './components/BrigunaPage4K7B9';
import BrigunaPage9X3M5 from './components/BrigunaPage9X3M5';
import BrigunaPage2F8N6 from './components/BrigunaPage2F8N6';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/revisi-briguna-digital/4K7B9" element={<BrigunaPage4K7B9 />} />
        <Route path="/revisi-briguna-digital/9X3M5" element={<BrigunaPage9X3M5 />} />
        <Route path="/revisi-briguna-digital/2F8N6" element={<BrigunaPage2F8N6 />} />
        <Route path="/" element={<Navigate to="/revisi-briguna-digital/2F8N6" replace />} />
        <Route path="*" element={<Navigate to="/revisi-briguna-digital/2F8N6" replace />} />
      </Routes>
    </Router>
  );
}

export default App

// In src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaymentQueue from './pages/PaymentQueue';
import AssignmentQueue from './pages/AssignmentQueue'; // <-- Import the new page

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/payments">Payment Verification</Link> | {" "}
          <Link to="/assignments">Driver Assignment</Link> {/* <-- Add a link */}
        </nav>
        <Routes>
          <Route path="/payments" element={<PaymentQueue />} />
          <Route path="/assignments" element={<AssignmentQueue />} /> {/* <-- Add the route */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
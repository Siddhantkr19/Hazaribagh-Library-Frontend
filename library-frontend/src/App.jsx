import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Home from "./pages/Home";
import Booking from "./pages/Booking"; 
import Dashboard from "./pages/Dashboard"; 
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;

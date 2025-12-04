import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import WelcomeOffer from "./components/WelcomeOffer";
import Home from "./pages/Home";
import Booking from "./pages/Booking"; // We will create this next
import Dashboard from "./pages/Dashboard"; 
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
        <Navbar />
        <WelcomeOffer />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

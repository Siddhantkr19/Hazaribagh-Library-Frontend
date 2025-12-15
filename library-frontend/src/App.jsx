import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PaymentHistory from "./pages/auth/PaymentHistory";
import Home from "./pages/Home";
import Booking from "./pages/Booking"; 
import Dashboard from "./pages/Dashboard"; 
import AllLibraries from "./pages/AllLibraries";
import LibraryDetails from './pages/LibraryDetails';
import Footer from './components/Footer';
import FallingBackground from './components/FallingBackground';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword" ;

function App() {
  return (
    <Router>
     {/* Main Container */}
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans relative">
        
        {/* 2. GLOBAL BACKGROUND LAYER */}
        {/* 'fixed' ensures it stays on screen even when scrolling. 'z-0' puts it behind everything. */}
        <div className="fixed inset-0 z-15 pointer-events-none">
           <FallingBackground />
        </div>

        {/* 3. CONTENT LAYER */}
        {/* 'relative' and 'z-10' ensure your buttons and text sit ON TOP of the falling background */}
        <div className="relative z-10">
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/history" element={<PaymentHistory />} />
          <Route path="/libraries" element={<AllLibraries />} />
          <Route path="/libraries/:id" element={<LibraryDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
      <Footer />
      </div>
    </Router>
  );
}

export default App;

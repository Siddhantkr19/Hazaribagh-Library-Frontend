import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'; // Ensure you created this file

// --- USER COMPONENTS ---
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import FallingBackground from './components/FallingBackground';

// --- USER PAGES ---
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import PaymentHistory from "./pages/auth/PaymentHistory";
import AllLibraries from "./pages/AllLibraries";
import LibraryDetails from './pages/LibraryDetails';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// --- NEW BOOKING PAGES (Nested) ---
import BookingLayout from './pages/Booking/BookingLayout';
import StepEmail from './pages/Booking/StepEmail';
import StepPayment from './pages/Booking/StepPayment';
import StepSuccess from './pages/Booking/StepSuccess';

// --- ADMIN COMPONENTS & PAGES ---
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingList from './pages/admin/BookingList';
import StudentList from './pages/admin/StudentList';
import ManageLibraries from './pages/admin/ManageLibraries';

// --- LAYOUT WRAPPER FOR USER PAGES ---
const MainLayout = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans relative">
    {/* Global Background */}
    <FallingBackground />

    {/* Content */}
    <div className="relative z-20 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
         <Outlet /> 
      </main>
      <Footer />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      {/* ScrollToTop ensures we start at the top of the page on navigation */}
      <ScrollToTop />

      <Routes>
        
        {/* GROUP 1: PUBLIC / USER ROUTES (With Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/libraries" element={<AllLibraries />} />
          <Route path="/libraries/:id" element={<LibraryDetails />} />
          
          {/* --- NEW NESTED BOOKING FLOW --- */}
          <Route path="/book/:id" element={<BookingLayout />}>
             {/* Step 1: Default (Email Check) */}
             <Route index element={<StepEmail />} />          
             
             {/* Step 2: Payment (Summary & Razorpay) */}
             <Route path="payment" element={<StepPayment />} /> 
             
             {/* Step 3: Success Ticket */}
             <Route path="success" element={<StepSuccess />} /> 
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<PaymentHistory />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* GROUP 2: ADMIN ROUTES (Sidebar Layout, No Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />     {/* /admin */}
          <Route path="bookings" element={<BookingList />} /> 
          <Route path="students" element={<StudentList />} /> 
          <Route path="libraries" element={<ManageLibraries />} />
          <Route path="finance" element={<AdminDashboard />} /> 
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
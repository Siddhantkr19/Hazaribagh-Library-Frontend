import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// --- USER COMPONENTS ---
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import FallingBackground from './components/FallingBackground';

// --- USER PAGES ---
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import PaymentHistory from "./pages/auth/PaymentHistory";
import AllLibraries from "./pages/AllLibraries";
import LibraryDetails from './pages/LibraryDetails';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// --- ADMIN COMPONENTS & PAGES ---
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingList from './pages/admin/BookingList';
import StudentList from './pages/admin/StudentList';
import ManageLibraries from './pages/admin/ManageLibraries';

// --- LAYOUT WRAPPER FOR USER PAGES ---
// This ensures Navbar/Footer/Background only appear on User pages, NOT Admin pages
const MainLayout = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans relative">
    {/* Global Background */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <FallingBackground />
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
         <Outlet /> {/* This renders the child route (e.g. Home, Login) */}
      </main>
      <Footer />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        
        {/* GROUP 1: PUBLIC / USER ROUTES (With Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/libraries" element={<AllLibraries />} />
          <Route path="/libraries/:id" element={<LibraryDetails />} />
          <Route path="/book/:id" element={<Booking />} />
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
          <Route path="bookings" element={<BookingList />} /> {/* /admin/bookings */}
          <Route path="students" element={<StudentList />} /> {/* /admin/students */}
          <Route path="libraries" element={<ManageLibraries />} />
          <Route path="finance" element={<AdminDashboard />} /> {/* /admin/finance (Finance Dashboard) */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AssignmentQueue from './pages/AssignmentQueue';
import DriverApprovals from './pages/DriverApprovals'; 
import PaymentQueue from './pages/PaymentQueue';
import { LayoutDashboard, Users, Car, CreditCard } from 'lucide-react';

function App() {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label }) => {
    // Check if the current path starts with the 'to' prop to keep it active
    const isActive = location.pathname.startsWith(to) && to !== '/' || location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
          isActive 
            ? 'bg-orange-500 text-white shadow-md shadow-orange-200' 
            : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
        <span className="font-semibold">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm z-10">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Car size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Nest Admin</h1>
        </div>
        <nav className="flex-1">
          <NavItem to="/assignments" icon={Users} label="Route Assignments" />
          <NavItem to="/drivers" icon={Car} label="Driver Approvals" />
          <NavItem to="/payments" icon={CreditCard} label="Payment Queue" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <Routes>
          {/* Automatically redirect the blank home page to assignments */}
          <Route path="/" element={<Navigate to="/assignments" replace />} />
          <Route path="/assignments" element={<AssignmentQueue />} />
          <Route path="/drivers" element={<DriverApprovals />} />
          <Route path="/payments" element={<PaymentQueue />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
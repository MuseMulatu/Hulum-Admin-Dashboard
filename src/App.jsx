import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AssignmentQueue from './pages/AssignmentQueue';
import DriverApprovals from './pages/DriverApprovals'; // We will create this next
import PaymentQueue from './pages/PaymentQueue';
import { LayoutDashboard, Users, Car, CreditCard } from 'lucide-react';

function App() {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-100'}`}>
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 pl-4">Nest Admin</h1>
        <nav>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/assignments" icon={Users} label="Route Assignments" />
          <NavItem to="/drivers" icon={Car} label="Driver Approvals" />
          <NavItem to="/payments" icon={CreditCard} label="Payment Queue" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Welcome to Admin</h1></div>} />
          <Route path="/assignments" element={<AssignmentQueue />} />
          <Route path="/drivers" element={<DriverApprovals />} />
          <Route path="/payments" element={<PaymentQueue />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, UserPlus, X } from 'lucide-react';

const API_BASE = 'https://api.zabiya.com/api/admin/nest-junior';

export default function AssignmentQueue() {
  const [routes, setRoutes] = useState([]);
  const [approvedDrivers, setApprovedDrivers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');

  const fetchData = async () => {
    try {
      const [routeRes, driverRes] = await Promise.all([
        axios.get(`${API_BASE}/routes/unassigned`),
        axios.get(`${API_BASE}/drivers/approved`)
      ]);
      setRoutes(routeRes.data);
      setApprovedDrivers(driverRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAssignModal = (routeId) => {
    setSelectedRouteId(routeId);
    setSelectedDriverId('');
    setMonthlyFee('');
    setIsModalOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedDriverId || !monthlyFee) return alert("Select a driver and set a price.");
    try {
      await axios.post(`${API_BASE}/routes/${selectedRouteId}/assign`, {
        driverId: selectedDriverId,
        monthlyFee: monthlyFee
      });
      setIsModalOpen(false);
      fetchData(); 
    } catch (err) {
      alert("Assignment failed");
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Route Assignments</h1>
        <p className="text-gray-500 mt-2">Manage incoming ride requests and pair them with approved CareDrivers.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-5 font-semibold">Student & School</th>
              <th className="p-5 font-semibold">Parent Contact</th>
              <th className="p-5 font-semibold">Locations</th>
              <th className="p-5 font-semibold">Plan Type</th>
              <th className="p-5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routes.map(route => {
              const parentInfo = route.student.parents[0]?.user;
              return (
                <tr key={route.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-gray-900 text-base">{route.student.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{route.student.schoolName}</p>
                  </td>
                  <td className="p-5">
                    <p className="font-medium text-gray-800">{parentInfo?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{parentInfo?.phone || 'No Phone'}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-start text-sm text-gray-600 mb-2">
                      <MapPin size={16} className="text-orange-500 mr-2 mt-0.5 shrink-0" />
                      <span className="line-clamp-1 max-w-[200px]">{route.pickupAddress}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin size={16} className="text-teal-500 mr-2 mt-0.5 shrink-0" />
                      <span className="line-clamp-1 max-w-[200px]">{route.dropoffAddress}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${route.type === 'PRIVATE' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {route.type}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => openAssignModal(route.id)} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 font-semibold transition-all"
                    >
                      <UserPlus size={16} /> Assign
                    </button>
                  </td>
                </tr>
              );
            })}
            {routes.length === 0 && (
              <tr><td colSpan="5" className="p-12 text-center text-gray-500">No unassigned routes at the moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assign Route</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Approved Driver</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-800"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                >
                  <option value="">-- Choose a CareDriver --</option>
                  {approvedDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.user.name} ({d.carModel} - {d.seats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Negotiated Fee (ETB)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ETB</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full py-3 pl-14 pr-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-800"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors">Cancel</button>
              <button onClick={handleAssign} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/30 text-white rounded-xl font-semibold transition-all">Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
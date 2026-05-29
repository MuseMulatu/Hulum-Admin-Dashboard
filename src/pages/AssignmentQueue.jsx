import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, UserPlus } from 'lucide-react';

const API_BASE = 'https://api.zabiya.com/api/admin/nest-junior';

export default function AssignmentQueue() {
  const [routes, setRoutes] = useState([]);
  const [approvedDrivers, setApprovedDrivers] = useState([]);
  
  // Modal State
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
      fetchData(); // Refresh list
    } catch (err) {
      alert("Assignment failed");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Route Triage & Assignment</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th className="p-4 font-semibold">Student & School</th>
              <th className="p-4 font-semibold">Parent Contact</th>
              <th className="p-4 font-semibold">Locations</th>
              <th className="p-4 font-semibold">Plan Type</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => {
              // Extract first parent for contact info
              const parentInfo = route.student.parents[0]?.user;
              
              return (
                <tr key={route.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{route.student.name}</p>
                    <p className="text-sm text-gray-500">{route.student.schoolName}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{parentInfo?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{parentInfo?.phone || 'No Phone'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin size={14} className="text-orange-500 mr-2" />
                      <span className="truncate max-w-xs">{route.pickupAddress}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="text-teal-500 mr-2" />
                      <span className="truncate max-w-xs">{route.dropoffAddress}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${route.type === 'PRIVATE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {route.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openAssignModal(route.id)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold ml-auto">
                      <UserPlus size={16} /> Assign Driver
                    </button>
                  </td>
                </tr>
              );
            })}
            {routes.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No unassigned routes.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Driver & Set Price</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Approved Driver</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                <option value="">-- Choose a Driver --</option>
                {approvedDrivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.user.name} ({d.carModel} - {d.seats} seats)
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Negotiated Fee (ETB)</label>
              <input 
                type="number" 
                placeholder="e.g. 3500" 
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold">Cancel</button>
              <button onClick={handleAssign} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold">Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
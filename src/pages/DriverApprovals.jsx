import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const API_BASE = 'https://api.zabiya.com/api/admin/nest-junior';

export default function DriverApprovals() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/drivers/pending`);
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this driver?")) return;
    try {
      await axios.post(`${API_BASE}/drivers/${id}/approve`);
      fetchDrivers(); // Refresh list
    } catch (err) {
      alert("Failed to approve");
    }
  };

  if (loading) return <div className="p-8">Loading drivers...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Driver Approvals</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th className="p-4 font-semibold">Driver Name</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Vehicle</th>
              <th className="p-4 font-semibold">Plate Number</th>
              <th className="p-4 font-semibold">Seats</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{driver.user.name}</td>
                <td className="p-4 text-gray-600">{driver.user.phone}</td>
                <td className="p-4 text-gray-600">{driver.carModel}</td>
                <td className="p-4 text-gray-600 font-mono">{driver.plateNumber}</td>
                <td className="p-4 text-gray-600">{driver.seats}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleApprove(driver.id)} className="flex items-center gap-2 px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 font-semibold ml-auto">
                    <CheckCircle size={16} /> Approve
                  </button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No pending drivers.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
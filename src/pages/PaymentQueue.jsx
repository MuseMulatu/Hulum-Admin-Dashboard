import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://api.zabiya.com/api/nest-junior/admin';

export default function PaymentQueue() {
  const [payments, setPayments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});

  useEffect(() => {
    // Mocked fetches. 
    // axios.get(`${API_BASE}/routes?status=PENDING_VERIFICATION`)
    setPayments([
      { id: '101', parentName: 'Abebe Kebede', pickup: 'Bole Atlas', type: 'SHARED', receiptUrl: 'https://via.placeholder.com/150' }
    ]);
    
    // axios.get(`${API_BASE}/drivers?status=APPROVED`)
    setDrivers([
      { id: 'd_1', name: 'Almaz (CareDriver)', car: 'Avanza', seats: 6 },
      { id: 'd_2', name: 'Sara (CareDriver)', car: 'Vitz', seats: 4 }
    ]);
  }, []);

  const handleApproveAndAssign = async (routeId) => {
    const driverId = selectedDriver[routeId];
    if (!driverId) return alert("Please select a driver first.");

    try {
      // THE MAGIC CALL: This backend endpoint will:
      // 1. Mark status ACTIVE
      // 2. Assign Driver
      // 3. Call 100ms API to generate Room ID
      // 4. Send Push Notif to Parent
      /*
      await axios.post(`${API_BASE}/routes/assign`, {
         routeId,
         driverId
      });
      */
      alert("Success! Driver Assigned and 100ms Live Room created permanently for this route.");
      setPayments(payments.filter(p => p.id !== routeId));
    } catch (error) {
      alert("Error assigning driver.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Verify Payment & Assign Driver</h1>
      <p className="mb-8 text-gray-500">Parents who have uploaded receipts. Verify the receipt, pick a driver, and activate the route.</p>

      <div className="grid gap-6">
        {payments.map(payment => (
          <div key={payment.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-6">
            {/* Receipt Image */}
            <div className="w-32 h-48 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80">
               <img src={payment.receiptUrl} alt="Receipt" className="object-cover w-full h-full" />
               <p className="text-center text-xs mt-1">View Receipt</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{payment.parentName}</h2>
                <p className="text-md text-gray-600 mt-1"><span className="font-semibold text-teal-600">{payment.type}</span> • {payment.pickup}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Assign to CareDriver:</label>
                <div className="flex gap-4">
                  <select 
                    className="select select-bordered w-full max-w-xs bg-white"
                    onChange={(e) => setSelectedDriver({...selectedDriver, [payment.id]: e.target.value})}
                  >
                    <option disabled selected>Select Driver</option>
                    {drivers.map(d => (
                       <option key={d.id} value={d.id}>{d.name} • {d.car} ({d.seats} seats)</option>
                    ))}
                  </select>
                  
                  <button 
                    onClick={() => handleApproveAndAssign(payment.id)}
                    className="btn bg-teal-500 hover:bg-teal-600 border-none text-white flex-1">
                    ✅ Approve Receipt & Activate Route
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Activating will automatically generate the 100ms tracking room for the parent.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, FileImage } from 'lucide-react';

const API_BASE = 'https://api.zabiya.com/api/nest-junior/admin';

export default function PaymentQueue() {
  const [payments, setPayments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});

  useEffect(() => {
    // Mocked fetches
    setPayments([
      { id: '101', parentName: 'Abebe Kebede', pickup: 'Bole Atlas', type: 'SHARED', receiptUrl: 'https://images.unsplash.com/photo-1620052581237-5d38fa2f741c?w=400&q=80' }
    ]);
    
    setDrivers([
      { id: 'd_1', name: 'Almaz (CareDriver)', car: 'Avanza', seats: 6 },
      { id: 'd_2', name: 'Sara (CareDriver)', car: 'Vitz', seats: 4 }
    ]);
  }, []);

  const handleApproveAndAssign = async (routeId) => {
    const driverId = selectedDriver[routeId];
    if (!driverId) return alert("Please select a driver first.");

    try {
      // await axios.post(`${API_BASE}/routes/${routeId}/activate`, { driverId });
      alert("Success! Route Activated and 100ms Live Room created permanently.");
      setPayments(payments.filter(p => p.id !== routeId));
    } catch (error) {
      alert("Error activating route.");
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Verification</h1>
        <p className="text-gray-500 mt-2">Verify parent receipts, finalize the driver match, and activate the route livestream.</p>
      </div>

      <div className="grid gap-6">
        {payments.map(payment => (
          <div key={payment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-8">
            
            {/* Receipt Image Side */}
            <div className="w-full md:w-48 h-64 bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-200 shrink-0">
               <img src={payment.receiptUrl} alt="Receipt" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white flex flex-col items-center">
                    <FileImage size={24} className="mb-1" />
                    <span className="text-sm font-semibold">View Full</span>
                  </div>
               </div>
            </div>
            
            {/* Details Side */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{payment.parentName}</h2>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                    PENDING REVIEW
                  </span>
                </div>
                <p className="text-base text-gray-600"><span className="font-semibold text-teal-600">{payment.type}</span> • Pickup: {payment.pickup}</p>
              </div>

              {/* Action Box */}
              <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Finalize Driver Assignment:</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select 
                    className="flex-1 p-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-gray-800"
                    onChange={(e) => setSelectedDriver({...selectedDriver, [payment.id]: e.target.value})}
                  >
                    <option disabled selected>-- Select a CareDriver --</option>
                    {drivers.map(d => (
                       <option key={d.id} value={d.id}>{d.name} • {d.car} ({d.seats} seats)</option>
                    ))}
                  </select>
                  
                  <button 
                    onClick={() => handleApproveAndAssign(payment.id)}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-600 shadow-md shadow-teal-500/30 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <CheckCircle2 size={20} />
                    Approve & Activate
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                   <span className="text-teal-500 text-lg leading-none">•</span> Activating generates the 100ms tracking room and notifies the parent.
                </p>
              </div>
            </div>

          </div>
        ))}

        {payments.length === 0 && (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
            No pending payments to review.
          </div>
        )}
      </div>
    </div>
  );
}
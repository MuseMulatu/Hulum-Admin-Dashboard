import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Camera, Clock, User } from 'lucide-react';

const API_BASE = 'https://api.zabiya.com/api/admin/nest';

export default function RouteAudit() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // Filters: ALL, HAS_PHOTOS

  const fetchAuditData = async () => {
    try {
      // You must pass the Admin Bearer token if your route is protected!
      const res = await axios.get(`${API_BASE}/routes/audit`);
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuditData(); }, []);

  const filteredRoutes = routes.filter(route => {
    if (filter === 'HAS_PHOTOS') return route.milestones.length > 0;
    return true;
  });

  if (loading) return <div className="p-8">Loading Route Audits...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Route Audits & Gallery</h1>
        
        {/* Simple Usability Filter */}
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700"
        >
          <option value="ALL">All Active Routes</option>
          <option value="HAS_PHOTOS">Only Routes with Snapshots</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredRoutes.map(route => (
          <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            
            {/* Header: Route Meta */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User size={20} className="text-teal-600"/>
                  Student: {route.student.name}
                </h2>
                <p className="text-gray-500 mt-1">Driver: {route.driver?.user?.name || 'Unassigned'}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <MapPin size={14} /> {route.locationLogs.length} GPS Pings
                </span>
              </div>
            </div>

            {/* Content: Photo Gallery */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Camera size={16} /> Snapshot Timeline ({route.milestones.length})
              </h3>
              
              {route.milestones.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {route.milestones.map(stone => (
                    <div key={stone.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={stone.photoUrl} 
                        alt="Security Snapshot" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                        <span className={`text-[10px] font-bold text-white px-2 py-1 rounded ${stone.type === 'BOARDING' ? 'bg-orange-500' : 'bg-teal-500'}`}>
                          {stone.type}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-1">
                        <Clock size={12} className="text-gray-300" />
                        <span className="text-xs text-gray-200">
                          {new Date(stone.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-400 border border-dashed border-gray-300">
                  No snapshots captured yet for this route.
                </div>
              )}
            </div>

          </div>
        ))}
        {filteredRoutes.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            No routes match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
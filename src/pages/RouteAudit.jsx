import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Camera, Clock, User, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE = 'https://api.zabiya.com/api/admin/nest';

export default function RouteAudit() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
  const [activeTab, setActiveTab] = useState({}); // Tracks whether viewing 'GALLERY' or 'MAP' per route

  const fetchAuditData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/routes/audit`);
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuditData(); }, []);

  const toggleTab = (routeId, tab) => {
    setActiveTab(prev => ({ ...prev, [routeId]: tab }));
  };

  const filteredRoutes = routes.filter(route => {
    if (filter === 'HAS_PHOTOS') return route.milestones.length > 0;
    return true;
  });

  if (loading) return <div className="p-8">Loading Route Audits...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Route Audits</h1>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white"
        >
          <option value="ALL">All Active Routes</option>
          <option value="HAS_PHOTOS">Only Routes with Snapshots</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredRoutes.map(route => {
          const viewMode = activeTab[route.id] || 'GALLERY';
          // Convert logs to Leaflet coordinate format: [lat, lng]
          const pathCoords = route.locationLogs.map(log => [log.latitude, log.longitude]);

          return (
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
                
                {/* View Toggles */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleTab(route.id, 'GALLERY')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewMode === 'GALLERY' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Camera size={16} /> Snapshots ({route.milestones.length})
                  </button>
                  <button 
                    onClick={() => toggleTab(route.id, 'MAP')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewMode === 'MAP' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <MapIcon size={16} /> Path Reconstruction ({route.locationLogs.length})
                  </button>
                </div>
              </div>

              {/* View 1: Snapshot Gallery */}
              {viewMode === 'GALLERY' && (
                <div>
                  {route.milestones.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {route.milestones.map(stone => (
                        <div key={stone.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                          <img src={stone.photoUrl} alt="Security Snapshot" className="w-full h-32 object-cover" />
                          <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                            <span className={`text-[10px] font-bold text-white px-2 py-1 rounded ${stone.type === 'BOARDING' ? 'bg-orange-500' : 'bg-teal-500'}`}>
                              {stone.type}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 flex items-center gap-1">
                            <Clock size={12} className="text-gray-300" />
                            <span className="text-xs text-gray-200">
                              {new Date(stone.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-400 border border-dashed">
                      No snapshots captured yet.
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Path Reconstruction Map */}
              {viewMode === 'MAP' && (
                <div className="rounded-lg overflow-hidden border border-gray-200 h-[400px] z-0">
                  {pathCoords.length > 0 ? (
                    <MapContainer 
                      center={pathCoords[0]} 
                      zoom={14} 
                      style={{ height: '100%', width: '100%', zIndex: 0 }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {/* Connect the dots to show the path taken */}
                      <Polyline positions={pathCoords} color="#FF8C00" weight={4} dashArray="5, 10" />
                      
                      {/* Plot every individual ping with a timestamp */}
                      {route.locationLogs.map((log, index) => (
                        <CircleMarker 
                          key={log.id} 
                          center={[log.latitude, log.longitude]} 
                          radius={6}
                          pathOptions={{ color: index === 0 ? 'green' : index === route.locationLogs.length - 1 ? 'red' : '#0FB1BB', fillColor: '#fff', fillOpacity: 1 }}
                        >
                          <Popup>
                            <div className="text-center font-bold">
                              {index === 0 ? 'Start Point' : index === route.locationLogs.length - 1 ? 'Latest Point' : `Ping #${index + 1}`} <br/>
                              <span className="text-gray-500 text-xs font-normal">
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400">
                      No GPS telemetry available for this route yet.
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
// src/pages/AssignmentQueue.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Configuration ---
// Make sure to use environment variables for this in a real app
const VITE_API_BASE_URL = 'https://app.share-rides.com/api';

const AssignmentQueue = () => {
    const [pendingRides, setPendingRides] = useState([]);
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the assignment modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const ridesPromise = axios.get(`${VITE_API_BASE_URL}/admin/rides/pending-assignment`);
                const driversPromise = axios.get(`${VITE_API_BASE_URL}/admin/available-drivers`);
                
                const [ridesResponse, driversResponse] = await Promise.all([ridesPromise, driversPromise]);
                
                setPendingRides(ridesResponse.data);
                setAvailableDrivers(driversResponse.data);
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openAssignModal = (ride) => {
        setSelectedRide(ride);
        setSelectedDriverId(availableDrivers[0]?.id || ''); // Pre-select the first driver
        setIsModalOpen(true);
    };

    const handleAssignDriver = async () => {
        if (!selectedDriverId) {
            alert('Please select a driver.');
            return;
        }
        setIsAssigning(true);
        try {
            await axios.post(`${VITE_API_BASE_URL}/admin/rides/${selectedRide.id}/assign-driver`, {
                driverId: selectedDriverId,
            });
            alert('Driver assigned successfully!');
            // Refresh list by removing the assigned ride
            setPendingRides(prev => prev.filter(ride => ride.id !== selectedRide.id));
            setIsModalOpen(false);
            setSelectedRide(null);
        } catch (err) {
            alert(`Assignment failed: ${err.response?.data?.error || 'Server error'}`);
            console.error(err);
        } finally {
            setIsAssigning(false);
        }
    };

    if (loading) return <div>Loading assignments...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Driver Assignment Queue</h1>
            <p>{pendingRides.length} ride(s) waiting for a driver.</p>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Reference ID</th>
                        <th style={styles.th}>Parent</th>
                        <th style={styles.th}>Child / Ride Type</th>
                        <th style={styles.th}>Route</th>
                        <th style={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRides.map(ride => (
                        <tr key={ride.id}>
                            <td style={styles.td}>{ride.reference_id}</td>
                            <td style={styles.td}>{ride.parent_name}</td>
                            <td style={styles.td}>{ride.ride_type === 'shared' ? ride.child_name : 'Private Ride'}</td>
                            <td style={styles.td}>{`${ride.pickup_address} -> ${ride.dropoff_address}`}</td>
                            <td style={styles.td}>
                                <button style={styles.button} onClick={() => openAssignModal(ride)}>Assign Driver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedRide && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2>Assign Driver</h2>
                        <p><strong>Ride Ref:</strong> {selectedRide.reference_id}</p>
                        <p><strong>Parent:</strong> {selectedRide.parent_name}</p>
                        <p><strong>Route:</strong> {`${selectedRide.pickup_address} -> ${selectedRide.dropoff_address}`}</p>
                        <hr style={{margin: '15px 0'}} />
                        <label htmlFor="driver-select" style={{ display: 'block', marginBottom: '5px' }}>Select an available driver:</label>
                        <select
                            id="driver-select"
                            value={selectedDriverId}
                            onChange={(e) => setSelectedDriverId(e.target.value)}
                            style={styles.select}
                        >
                            {availableDrivers.map(driver => (
                                <option key={driver.id} value={driver.id}>{driver.username}</option>
                            ))}
                        </select>
                        <div style={styles.modalActions}>
                            <button style={styles.buttonClose} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button style={styles.buttonConfirm} onClick={handleAssignDriver} disabled={isAssigning}>
                                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Basic Styling ---
const styles = {
    container: { fontFamily: 'sans-serif', padding: '20px' },
    header: { color: '#333' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { border: '1px solid #ddd', padding: '8px' },
    button: { cursor: 'pointer', backgroundColor: '#0FB1BB', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' },
    select: { width: '100%', padding: '8px', marginBottom: '20px' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    buttonClose: { cursor: 'pointer', backgroundColor: '#777', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px' },
    buttonConfirm: { cursor: 'pointer', backgroundColor: '#22C55E', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px' },
};

export default AssignmentQueue;
// src/pages/PaymentQueue.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin'; // Your backend URL

const PaymentQueue = () => {
    const [pendingPayments, setPendingPayments] = useState([]);

    useEffect(() => {
        // You need to create this backend endpoint: GET /api/admin/pending-payments
        axios.get(`${API_URL}/pending-payments`).then(res => setPendingPayments(res.data));
    }, []);

    const approvePayment = (rideId) => {
        axios.post(`${API_URL}/rides/${rideId}/confirm-payment`)
            .then(() => {
                alert('Payment Approved!');
                setPendingPayments(prev => prev.filter(p => p.id !== rideId));
            })
            .catch(() => alert('Approval failed!'));
    };

    return (
        <div>
            <h1>Payment Verification Queue</h1>
            <table>
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Amount</th>
                        <th>Receipt</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingPayments.map(ride => (
                        <tr key={ride.id}>
                            <td>{ride.reference_id}</td>
                            <td>{ride.amount_due} ETB</td>
                            <td><a href={ride.payment_receipt_url} target="_blank" rel="noopener noreferrer">View Receipt</a></td>
                            <td><button onClick={() => approvePayment(ride.id)}>Approve</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default PaymentQueue;
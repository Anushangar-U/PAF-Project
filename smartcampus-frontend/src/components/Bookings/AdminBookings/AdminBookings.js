import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceService from '../../../services/ResourceService';
import './AdminBookings.css';

const API_URL = 'http://localhost:9091/api/bookings';
const STATUS_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');

    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [approveId, setApproveId] = useState(null);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => { fetchBookings(); }, []);
    useEffect(() => { applyFilters(); }, [bookings, statusFilter, dateFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(API_URL);
            const bookingsData = res.data;
            const bookingsWithResource = await Promise.all(
                bookingsData.map(async (b) => {
                    try {
                        if (b.resourceId) {
                            const resourceRes = await ResourceService.getResourceById(b.resourceId);
                            return { ...b, resourceName: resourceRes?.data?.name || `Resource ${b.resourceId}` };
                        }
                        return { ...b, resourceName: 'N/A' };
                    } catch {
                        return { ...b, resourceName: `Resource ${b.resourceId || 'N/A'}` };
                    }
                })
            );
            setBookings(bookingsWithResource);
        } catch {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let data = [...bookings];
        if (statusFilter !== 'ALL') data = data.filter((b) => b.status === statusFilter);
        if (dateFilter) {
            data = data.filter((b) => {
                if (!b.startTime) return false;
                const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
                return bookingDate === dateFilter;
            });
        }
        setFiltered(data);
    };

    const renderStatusBadge = (status) => (
        <span className={`admin-bookings-status ${status.toLowerCase()}`}>
            {status}
        </span>
    );

    // Format date/time for table display (e.g., '20 Apr 2026, 10:00')
    const formatBookingTime = (dateTime) => {
        try {
            const d = new Date(dateTime);
            if (isNaN(d)) return dateTime;
            const day = d.getDate().toString().padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[d.getMonth()];
            const year = d.getFullYear();
            const hour = d.getHours().toString().padStart(2, '0');
            const min = d.getMinutes().toString().padStart(2, '0');
            return `${day} ${month} ${year}, ${hour}:${min}`;
        } catch {
            return dateTime;
        }
    };

    const openApproveConfirm = (id) => { setApproveId(id); setShowApproveConfirm(true); };
    const handleApprove = async () => {
        if (!approveId) return;
        try {
            await axios.put(`${API_URL}/${approveId}/approve`);
            setShowApproveConfirm(false);
            setApproveId(null);
            fetchBookings();
        } catch {
            alert('Failed to approve booking');
        }
    };

    const openRejectModal = (id) => { setRejectId(id); setRejectReason(''); setShowRejectModal(true); };
    const handleReject = async () => {
        if (!rejectId) return;
        if (!rejectReason.trim()) { alert('Please enter a rejection reason'); return; }
        try {
            await axios.put(`${API_URL}/${rejectId}/reject`, { reason: rejectReason });
            setShowRejectModal(false);
            setRejectId(null);
            setRejectReason('');
            fetchBookings();
        } catch {
            alert('Failed to reject booking');
        }
    };

    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const approved = bookings.filter((b) => b.status === 'APPROVED').length;
    const rejected = bookings.filter((b) => b.status === 'REJECTED').length;

    return (
        <div className="admin-bookings-container">
            {/* Page Header */}
            <div className="admin-bookings-header">
                <h1>Admin Bookings</h1>
                <div className="subtitle">Manage, review, and take action on all resource bookings</div>
            </div>

            {/* Summary Cards */}
            <div className="admin-bookings-summary">
                <div className="card total">
                    <div className="icon">📅</div>
                    <div className="count">{total}</div>
                    <div className="label">Total Bookings</div>
                </div>
                <div className="card pending">
                    <div className="icon">⏳</div>
                    <div className="count">{pending}</div>
                    <div className="label">Pending</div>
                </div>
                <div className="card approved">
                    <div className="icon">✅</div>
                    <div className="count">{approved}</div>
                    <div className="label">Approved</div>
                </div>
                <div className="card rejected">
                    <div className="icon">❌</div>
                    <div className="count">{rejected}</div>
                    <div className="label">Rejected</div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="admin-bookings-toolbar">
                <div>
                    <label>Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Date</label>
                    <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <div className="admin-bookings-table-wrapper">
                <h3>All Bookings</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : filtered.length === 0 ? (
                    <div>No bookings found.</div>
                ) : (
                    <table className="admin-bookings-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Resource</th>
                                <th>User</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b, idx) => (
                                <tr key={b.id} className={idx % 2 === 1 ? 'striped' : ''}>
                                    <td title={b.id}>{b.id ? `...${b.id.slice(-6)}` : ''}</td>
                                    <td>{b.resourceName}</td>
                                    <td>{b.userId}</td>
                                    <td>{formatBookingTime(b.startTime)}</td>
                                    <td>{formatBookingTime(b.endTime)}</td>
                                    <td>{b.purpose}</td>
                                    <td>{renderStatusBadge(b.status)}</td>
                                    <td>
                                        {b.status === 'PENDING' ? (
                                            <>
                                                <button className="approve-btn" onClick={() => openApproveConfirm(b.id)}>Approve</button>
                                                <button className="reject-btn" onClick={() => openRejectModal(b.id)}>Reject</button>
                                            </>
                                        ) : (
                                            <span className="no-actions">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Approve Modal */}
            {showApproveConfirm && (
                <div className="admin-bookings-overlay">
                    <div className="admin-bookings-modal">
                        <h3>Approve Booking</h3>
                        <div>Are you sure you want to approve this booking?</div>
                        <div className="modal-actions">
                            <button className="secondary-btn" onClick={() => { setShowApproveConfirm(false); setApproveId(null); }}>Cancel</button>
                            <button className="approve-btn" onClick={handleApprove}>Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="admin-bookings-overlay">
                    <div className="admin-bookings-modal">
                        <h3>Reject Booking</h3>
                        <div>Enter reason for rejection:</div>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} />
                        <div className="modal-actions">
                            <button className="secondary-btn" onClick={() => { setShowRejectModal(false); setRejectId(null); setRejectReason(''); }}>Cancel</button>
                            <button className="reject-btn" onClick={handleReject}>Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
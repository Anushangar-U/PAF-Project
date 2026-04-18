import React, { useEffect, useState } from 'react';
import BookingFormModal from '../BookingFormModal';
import { getBookingsByUserId } from '../../../services/BookingService';
import ResourceService from '../../../services/ResourceService';
import './MyBookings.css';

// Temporary placeholder until authentication is implemented.
const TEMP_USER_ID = 1;

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [editBooking, setEditBooking] = useState(null); // holds booking to edit
    const [cancelId, setCancelId] = useState(null);

    const refreshBookings = () => {
        setLoading(true);
        setError('');
        getBookingsByUserId(TEMP_USER_ID)
            .then(async res => {
                const bookingsData = res.data;
                const bookingsWithResource = await Promise.all(
                    bookingsData.map(async (b) => {
                        if (b.resourceId) {
                            try {
                                const resourceRes = await ResourceService.getResourceById(b.resourceId);
                                return { ...b, resourceName: resourceRes.data.name };
                            } catch {
                                return { ...b, resourceName: 'N/A' };
                            }
                        }
                        return { ...b, resourceName: 'N/A' };
                    })
                );
                setBookings(bookingsWithResource);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch bookings');
                setLoading(false);
            });
    };

    useEffect(() => {
        refreshBookings();
    }, []);

    if (loading) return <div className="mybookings-loading">Loading...</div>;
    if (error) return <div className="mybookings-error">{error}</div>;

    const renderStatusBadge = (status) => (
        <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
    );

    const openCancelModal = (id) => {
        setCancelId(id);
        setShowModal(true);
    };

    const handleModalCancel = () => {
        setShowModal(false);
        setCancelId(null);
    };

    const handleModalConfirm = async () => {
        if (!cancelId) return;
        try {
            const { cancelBooking } = await import('../../../services/BookingService');
            await cancelBooking(cancelId);
            setShowModal(false);
            setCancelId(null);
            setLoading(true);
            setError('');
            getBookingsByUserId(TEMP_USER_ID)
                .then(async res => {
                    const bookingsData = res.data;
                    const bookingsWithResource = await Promise.all(
                        bookingsData.map(async (b) => {
                            if (b.resourceId) {
                                try {
                                    const resourceRes = await ResourceService.getResourceById(b.resourceId);
                                    return { ...b, resourceName: resourceRes.data.name };
                                } catch {
                                    return { ...b, resourceName: 'N/A' };
                                }
                            }
                            return { ...b, resourceName: 'N/A' };
                        })
                    );
                    setBookings(bookingsWithResource);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to fetch bookings');
                    setLoading(false);
                });
        } catch {
            alert('Failed to cancel booking.');
        }
    };

    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const approved = bookings.filter((b) => b.status === 'APPROVED').length;
    const rejected = bookings.filter((b) => b.status === 'REJECTED').length;

    return (
        <div className="mybookings-container">
            <button className="action-button approve" style={{marginBottom: '1.5rem'}} onClick={() => setShowBookingModal(true)}>
                Book Resource
            </button>
            {/* Page Header */}
            <div className="mybookings-header">
                <h1 className="mybookings-title">My Bookings</h1>
                <div className="mybookings-subtitle">View and manage your resource bookings</div>
            </div>

            {/* Summary Cards */}
            <div className="mybookings-summary">
                <div className="summary-card total">
                    <div className="icon">📅</div>
                    <div className="count">{total}</div>
                    <div className="label">Total Bookings</div>
                </div>
                <div className="summary-card pending">
                    <div className="icon">⏳</div>
                    <div className="count">{pending}</div>
                    <div className="label">Pending</div>
                </div>
                <div className="summary-card approved">
                    <div className="icon">✅</div>
                    <div className="count">{approved}</div>
                    <div className="label">Approved</div>
                </div>
                <div className="summary-card rejected">
                    <div className="icon">❌</div>
                    <div className="count">{rejected}</div>
                    <div className="label">Rejected</div>
                </div>
            </div>

            {/* Table */}
            <div className="booking-table-wrapper">
                <h3 className="booking-table-title">All Bookings</h3>
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Purpose</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-bookings">No bookings found.</td>
                            </tr>
                        )}
                        {bookings.map((b, idx) => (
                            <tr key={b.id} className={idx % 2 === 1 ? 'striped' : ''}>
                                <td>{b.resourceName}</td>
                                <td>{b.purpose || 'N/A'}</td>
                                <td>{formatDateTime(b.startTime)}</td>
                                <td>{formatDateTime(b.endTime)}</td>
                                <td>{renderStatusBadge(b.status)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                                            <button
                                                className="action-button cancel"
                                                onClick={() => openCancelModal(b.id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            className="action-button approve"
                                            style={{ background: '#fffbe6', color: '#b26a00', border: '1.5px solid #ffe6b3', fontWeight: 600, padding: '6px 16px', borderRadius: 6, cursor: 'pointer' }}
                                            onClick={() => { setEditBooking(b); setShowBookingModal(true); }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingFormModal
                    onClose={() => { setShowBookingModal(false); setEditBooking(null); }}
                    onBooked={refreshBookings}
                    booking={editBooking}
                />
            )}

            {/* Cancel Booking Modal */}
            {showModal && (
                <div className="mybookings-overlay">
                    <div className="mybookings-modal">
                        <h3 className="modal-title">Cancel Booking</h3>
                        <div className="modal-message">Are you sure you want to cancel this booking?</div>
                        <div className="modal-actions">
                            <button className="action-button secondary" onClick={handleModalCancel}>No</button>
                            <button className="action-button reject" onClick={handleModalConfirm}>Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Format date/time for table display
function formatDateTime(dateTime) {
    try {
        const d = new Date(dateTime);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return d.toLocaleString('en-GB', options);
    } catch {
        return dateTime;
    }
}

export default MyBookings;
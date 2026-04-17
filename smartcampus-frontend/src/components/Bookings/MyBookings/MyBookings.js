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
            {/* Page Header with Book Resource Button on the right */}
            <div className="mybookings-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                <div>
                    <h1 className="mybookings-title" style={{ marginBottom: 2 }}>My Bookings</h1>
                    <div className="mybookings-subtitle">View and manage your resource bookings</div>
                </div>
                <button
                    onClick={() => setShowBookingModal(true)}
                    style={{
                        background: 'linear-gradient(90deg, #c62828 60%, #b71c1c 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 15,
                        padding: '10px 39px',
                        fontWeight: 700,
                        fontSize: 17,
                        boxShadow: '0 2px 12px rgba(198,40,40,0.10)',
                        cursor: 'pointer',
                        transition: 'background 0.5s, box-shadow 0.5s',
                        outline: 'none',
                        marginLeft: 24,
                        marginTop: 8,
                        marginBottom: 8,
                        letterSpacing: 0.2
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #8f0202 60%, #800808 100%)'}
                    onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #b31515 60%, #faacac 100%)'}
                >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 2 }}><rect x="3" y="5" width="18" height="14" rx="3" fill="#fff" fillOpacity="0.13"/><path d="M8 11h8M12 7v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                        Book Resource
                    </span>
                </button>
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
                                    {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                                        <button
                                            className="action-button cancel"
                                            onClick={() => openCancelModal(b.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingFormModal
                    onClose={() => setShowBookingModal(false)}
                    onBooked={refreshBookings}
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
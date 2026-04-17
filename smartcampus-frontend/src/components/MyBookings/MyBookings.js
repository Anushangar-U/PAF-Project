
import React, { useEffect, useState } from 'react';
import { getBookingsByUserId } from '../../services/BookingService';
import ResourceService from '../../services/ResourceService';

// Temporary placeholder until authentication is implemented.
const TEMP_USER_ID = 1;


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    getBookingsByUserId(TEMP_USER_ID)
      .then(async res => {
        const bookingsData = res.data;
        // Fetch resource details for each booking
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
      .catch(err => {
        setError('Failed to fetch bookings');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  // Helper to render colored status badge
  const renderStatusBadge = (status) => {
    let color = '#aaa';
    let bg = '#eee';
    switch (status) {
      case 'PENDING':
        color = '#b26a00'; bg = '#fff3cd'; break;
      case 'APPROVED':
        color = '#217a36'; bg = '#d4edda'; break;
      case 'REJECTED':
        color = '#a71d2a'; bg = '#f8d7da'; break;
      case 'CANCELLED':
        color = '#555'; bg = '#f1f1f1'; break;
      default:
        break;
    }
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 12px',
        borderRadius: '12px',
        fontWeight: 600,
        color,
        background: bg,
        fontSize: '0.95em',
        letterSpacing: 1
      }}>{status}</span>
    );
  };

  // Cancel booking handler

  // Open modal for cancel confirmation
  const openCancelModal = (id) => {
    setCancelId(id);
    setShowModal(true);
  };

  // Handle modal cancel action
  const handleModalCancel = () => {
    setShowModal(false);
    setCancelId(null);
  };

  // Handle modal confirm action
  const handleModalConfirm = async () => {
    if (!cancelId) return;
    try {
      const { cancelBooking } = await import('../services/BookingService');
      await cancelBooking(cancelId);
      setShowModal(false);
      setCancelId(null);
      // Refresh bookings list after cancel
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
        .catch(err => {
          setError('Failed to fetch bookings');
          setLoading(false);
        });
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  // Summary counts
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'PENDING').length;
  const approved = bookings.filter((b) => b.status === 'APPROVED').length;
  const rejected = bookings.filter((b) => b.status === 'REJECTED').length;

  // Table styles
  const thStyle = {
    border: '1px solid #eee',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 700,
  };
  const tdStyle = {
    border: '1px solid #eee',
    padding: '12px',
    verticalAlign: 'middle',
  };

  // Modernized table and summary cards
  return (
    <div style={{ maxWidth: 1200, margin: '2.5rem auto', fontFamily: 'inherit', background: '#f8fafc', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', padding: '2.5rem 2rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e3656', marginBottom: 6, letterSpacing: 0.5 }}>My Bookings</h1>
        <div style={{ color: '#718096', fontSize: 17, fontWeight: 500 }}>View and manage your resource bookings</div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 28, marginBottom: 36, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(99,179,237,0.07)', padding: '1.5rem 1.7rem', textAlign: 'center', border: '1.5px solid #e3e8ee' }}>
          <div style={{ fontSize: 30, marginBottom: 8, color: '#63b3ed' }}>📅</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: '#1e3656' }}>{total}</div>
          <div style={{ color: '#718096', fontWeight: 600, fontSize: 15, marginTop: 2 }}>Total Bookings</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(255,193,7,0.07)', padding: '1.5rem 1.7rem', textAlign: 'center', border: '1.5px solid #ffe6b3' }}>
          <div style={{ fontSize: 30, marginBottom: 8, color: '#ff9100' }}>⏳</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: '#b26a00' }}>{pending}</div>
          <div style={{ color: '#b26a00', fontWeight: 600, fontSize: 15, marginTop: 2 }}>Pending</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(33,122,54,0.07)', padding: '1.5rem 1.7rem', textAlign: 'center', border: '1.5px solid #b7f7d8' }}>
          <div style={{ fontSize: 30, marginBottom: 8, color: '#38c172' }}>✅</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: '#217a36' }}>{approved}</div>
          <div style={{ color: '#217a36', fontWeight: 600, fontSize: 15, marginTop: 2 }}>Approved</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(167,29,42,0.07)', padding: '1.5rem 1.7rem', textAlign: 'center', border: '1.5px solid #ffd6db' }}>
          <div style={{ fontSize: 30, marginBottom: 8, color: '#e53e3e' }}>❌</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: '#a71d2a' }}>{rejected}</div>
          <div style={{ color: '#a71d2a', fontWeight: 600, fontSize: 15, marginTop: 2 }}>Rejected</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(99,179,237,0.04)', padding: '1.7rem 1.2rem', border: '1.5px solid #e3e8ee' }}>
        <h3 style={{ marginBottom: 20, fontWeight: 800, fontSize: 22, color: '#1e3656', letterSpacing: 0.2 }}>All Bookings</h3>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f7f7fa' }}>
              <th style={{ ...thStyle, minWidth: 120 }}>Resource</th>
              <th style={{ ...thStyle, minWidth: 120 }}>Purpose</th>
              <th style={{ ...thStyle, minWidth: 120 }}>Start Time</th>
              <th style={{ ...thStyle, minWidth: 120 }}>End Time</th>
              <th style={{ ...thStyle, minWidth: 100 }}>Status</th>
              <th style={{ ...thStyle, minWidth: 120 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No bookings found.</td></tr>
            )}
            {bookings.map(b => (
              <tr key={b.id}>
                <td style={tdStyle}>{b.resourceName}</td>
                <td style={tdStyle}>{b.purpose || 'N/A'}</td>
                <td style={tdStyle}>{formatDateTime(b.startTime)}</td>
                <td style={tdStyle}>{formatDateTime(b.endTime)}</td>
                <td style={tdStyle}>{renderStatusBadge(b.status)}</td>
                <td style={tdStyle}>
                  {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                    <button onClick={() => openCancelModal(b.id)} style={{
                      background: '#eee',
                      color: '#a71d2a',
                      border: '1px solid #a71d2a',
                      borderRadius: 6,
                      padding: '4px 14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel Booking Modal */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: 12, fontSize: '1.3rem', color: '#a71d2a' }}>Cancel Booking</h3>
            <div style={{ marginBottom: 24, fontSize: '1.08rem' }}>Are you sure you want to cancel this booking?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button onClick={handleModalCancel} style={secondaryButtonStyle}>No</button>
              <button onClick={handleModalConfirm} style={rejectButtonStyle}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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



const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.25)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  padding: '2rem 2.5rem',
  minWidth: 340,
  maxWidth: '90vw',
  textAlign: 'center',
  border: '1px solid #eee',
};

const secondaryButtonStyle = {
  background: '#f1f1f1',
  color: '#333',
  border: '1px solid #bbb',
  borderRadius: 6,
  padding: '6px 18px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};

const rejectButtonStyle = {
  background: '#a71d2a',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 18px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(167,29,42,0.08)',
};


};

export default MyBookings;

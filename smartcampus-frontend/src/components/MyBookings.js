
import React, { useEffect, useState } from 'react';
import { getBookingsByUserId } from '../services/BookingService';
import ResourceService from '../services/ResourceService';

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

  // Helper to format date and time
  const formatBookingTime = (date, startTime, endTime) => {
    // Handles both split fields and ISO strings
    try {
      let startDateObj, endDateObj;
      if (date && startTime && endTime) {
        // If date and time are separate fields
        startDateObj = new Date(`${date}T${startTime}`);
        endDateObj = new Date(`${date}T${endTime}`);
      } else if (startTime && endTime && !date) {
        // If startTime/endTime are full ISO strings
        startDateObj = new Date(startTime);
        endDateObj = new Date(endTime);
      } else {
        // Fallback: try to parse whatever is available
        startDateObj = new Date(startTime || date);
        endDateObj = new Date(endTime || date);
      }
      if (isNaN(startDateObj) || isNaN(endDateObj)) throw new Error('Invalid date');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayNum = startDateObj.getDate();
      const monthName = months[startDateObj.getMonth()];
      const yearNum = startDateObj.getFullYear();
      const formatTime = d => {
        let h = d.getHours();
        const m = d.getMinutes();
        const ampm = h >= 12 ? 'AM' : 'PM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
      };
      return `${dayNum} ${monthName} ${yearNum}, ${formatTime(startDateObj)} - ${formatTime(endDateObj)}`;
    } catch {
      // fallback to raw values
      return `${date} ${startTime} - ${endTime}`;
    }
  };

  return (
    <div style={{maxWidth: 800, margin: '2rem auto'}}>
      <h2>My Bookings</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Resource</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Purpose</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Time</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Status</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center'}}>No bookings found.</td></tr>
          )}
          {bookings.map(b => (
            <tr key={b.id}>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.resourceName}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.purpose || 'N/A'}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>
                {formatBookingTime(b.date, b.startTime, b.endTime)}
              </td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{renderStatusBadge(b.status)}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>
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
      {/* Cancel Booking Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.25)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            padding: '2rem 2.5rem',
            minWidth: 320,
            maxWidth: '90vw',
            textAlign: 'center',
            border: '1px solid #eee'
          }}>
            <h3 style={{marginBottom: 12, fontSize: '1.3rem', color: '#a71d2a'}}>Cancel Booking</h3>
            <div style={{marginBottom: 24, fontSize: '1.08rem'}}>Are you sure you want to cancel this booking?</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
              <button onClick={handleModalCancel} style={{
                background: '#f1f1f1', color: '#333', border: '1px solid #bbb', borderRadius: 6,
                padding: '6px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
              }}>No</button>
              <button onClick={handleModalConfirm} style={{
                background: '#a71d2a', color: '#fff', border: 'none', borderRadius: 6,
                padding: '6px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(167,29,42,0.08)'
              }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

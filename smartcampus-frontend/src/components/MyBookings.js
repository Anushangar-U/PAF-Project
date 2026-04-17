
import React, { useEffect, useState } from 'react';
import { getBookingsByUserId } from '../services/BookingService';
import ResourceService from '../services/ResourceService';

// Temporary placeholder until authentication is implemented.
const TEMP_USER_ID = 1;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div style={{maxWidth: 600, margin: '2rem auto'}}>
      <h2>My Bookings</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Resource</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Time</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr><td colSpan="3" style={{textAlign: 'center'}}>No bookings found.</td></tr>
          )}
          {bookings.map(b => (
            <tr key={b.id}>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.resourceName}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>
                {b.date} {b.startTime} - {b.endTime}
              </td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{renderStatusBadge(b.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;

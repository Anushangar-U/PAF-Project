import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/bookings/my')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch bookings');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

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
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.resource?.name || b.resourceName || 'N/A'}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>
                {b.date} {b.startTime} - {b.endTime}
              </td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;

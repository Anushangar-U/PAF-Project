
import React, { useEffect, useState } from 'react';
import ResourceService from '../services/ResourceService';
import axios from 'axios';

const API_URL = 'http://localhost:9091/api/bookings';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      const bookingsData = res.data;
      // Fetch resource names for each booking
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
    } catch {
      setError('Failed to fetch bookings');
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let data = [...bookings];
    if (statusFilter !== 'ALL') {
      data = data.filter(b => b.status === statusFilter);
    }
    if (dateFilter) {
      data = data.filter(b => {
        // Accept if booking date matches filter date
        if (!b.date) return false;
        return b.date === dateFilter;
      });
    }
    setFiltered(data);
  };

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
        letterSpacing: 1,
        minWidth: 80,
        textAlign: 'center',
      }}>{status}</span>
    );
  };

  const formatBookingTime = (date, startTime, endTime) => {
    try {
      let startDateObj, endDateObj;
      if (date && startTime && endTime) {
        startDateObj = new Date(`${date}T${startTime}`);
        endDateObj = new Date(`${date}T${endTime}`);
      } else if (startTime && endTime && !date) {
        startDateObj = new Date(startTime);
        endDateObj = new Date(endTime);
      } else {
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
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
      };
      return `${dayNum} ${monthName} ${yearNum}, ${formatTime(startDateObj)} - ${formatTime(endDateObj)}`;
    } catch {
      return `${date} ${startTime} - ${endTime}`;
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/approve`);
      fetchBookings();
    } catch {
      alert('Failed to approve booking.');
    }
  };

  const openRejectModal = (id) => {
    setRejectId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await axios.put(`${API_URL}/${rejectId}/reject`, { reason: rejectReason });
      setShowRejectModal(false);
      setRejectId(null);
      setRejectReason('');
      fetchBookings();
    } catch {
      alert('Failed to reject booking.');
    }
  };

  // Dashboard summary
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'PENDING').length;
  const approved = bookings.filter(b => b.status === 'APPROVED').length;
  const rejected = bookings.filter(b => b.status === 'REJECTED').length;

  return (
    <div style={{maxWidth: 1100, margin: '2rem auto', fontFamily: 'inherit'}}>
      {/* Dashboard Cards */}
      <div style={{display: 'flex', gap: 24, marginBottom: 32}}>
        <div style={{flex: 1, background: '#f7f7fa', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontSize: 28, color: '#6c63ff', marginBottom: 6}}><span role="img" aria-label="calendar">📅</span></div>
          <div style={{fontWeight: 700, fontSize: 22}}>{total}</div>
          <div style={{fontSize: 15, color: '#888'}}>Total Bookings</div>
        </div>
        <div style={{flex: 1, background: '#fff7e6', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontSize: 28, color: '#b26a00', marginBottom: 6}}><span role="img" aria-label="pending">⏳</span></div>
          <div style={{fontWeight: 700, fontSize: 22}}>{pending}</div>
          <div style={{fontSize: 15, color: '#b26a00'}}>Pending</div>
        </div>
        <div style={{flex: 1, background: '#e6fff2', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontSize: 28, color: '#217a36', marginBottom: 6}}><span role="img" aria-label="approved">✅</span></div>
          <div style={{fontWeight: 700, fontSize: 22}}>{approved}</div>
          <div style={{fontSize: 15, color: '#217a36'}}>Approved</div>
        </div>
        <div style={{flex: 1, background: '#fff0f0', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontSize: 28, color: '#a71d2a', marginBottom: 6}}><span role="img" aria-label="rejected">❌</span></div>
          <div style={{fontWeight: 700, fontSize: 22}}>{rejected}</div>
          <div style={{fontSize: 15, color: '#a71d2a'}}>Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1rem 1.5rem', marginBottom: 24}}>
        <div>
          <label style={{fontWeight: 500, marginRight: 8}}>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{padding: '6px 16px', borderRadius: 6, border: '1px solid #ccc', fontSize: 15}}>
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontWeight: 500, marginRight: 8}}>Date</label>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{padding: '6px 16px', borderRadius: 6, border: '1px solid #ccc', fontSize: 15}} />
        </div>
        <button onClick={applyFilters} style={{background: '#ff9100', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 22px', fontWeight: 600, fontSize: 15, marginLeft: 8, boxShadow: '0 2px 8px rgba(255,145,0,0.08)', cursor: 'pointer'}}>
          <span role="img" aria-label="filter">&#128269;</span> Apply Filter
        </button>
      </div>

      {/* Table */}
      <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.5rem'}}>
        <h3 style={{marginBottom: 18, fontWeight: 700, fontSize: 20, color: '#222'}}>All Bookings</h3>
        {loading ? <div>Loading...</div> : error ? <div style={{color: 'red'}}>{error}</div> : (
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 15}}>
            <thead>
              <tr style={{background: '#f7f7fa'}}>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>ID</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>Resource</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>User ID</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>Start Time</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>End Time</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>Purpose</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>Status</th>
                <th style={{border: '1px solid #eee', padding: '10px 8px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: 24}}>No bookings found.</td></tr>
              )}
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{border: '1px solid #eee', padding: '8px', color: '#6c63ff', fontWeight: 600}}>{b.id ? `#${b.id}` : ''}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>{b.resourceName}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>{b.userId || 'N/A'}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>{formatBookingTime(b.date, b.startTime, b.startTime)}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>{formatBookingTime(b.date, b.endTime, b.endTime)}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>{b.purpose || 'N/A'}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>{renderStatusBadge(b.status)}</td>
                  <td style={{border: '1px solid #eee', padding: '8px'}}>
                    {b.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleApprove(b.id)} style={{
                          background: '#217a36', color: '#fff', border: 'none', borderRadius: 6,
                          padding: '4px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer', fontSize: 15
                        }}>Approve</button>
                        <button onClick={() => openRejectModal(b.id)} style={{
                          background: '#a71d2a', color: '#fff', border: 'none', borderRadius: 6,
                          padding: '4px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 15
                        }}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            padding: '2rem 2.5rem', minWidth: 320, maxWidth: '90vw', textAlign: 'center', border: '1px solid #eee'
          }}>
            <h3 style={{marginBottom: 12, fontSize: '1.3rem', color: '#a71d2a'}}>Reject Booking</h3>
            <div style={{marginBottom: 16, fontSize: '1.08rem'}}>Enter reason for rejection:</div>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} style={{width: '100%', borderRadius: 6, border: '1px solid #bbb', padding: 8, marginBottom: 18}} />
            <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
              <button onClick={() => setShowRejectModal(false)} style={{
                background: '#f1f1f1', color: '#333', border: '1px solid #bbb', borderRadius: 6,
                padding: '6px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={handleReject} style={{
                background: '#a71d2a', color: '#fff', border: 'none', borderRadius: 6,
                padding: '6px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(167,29,42,0.08)'
              }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;

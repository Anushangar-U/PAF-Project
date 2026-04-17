import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceService from '../../services/ResourceService';

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

      const bookingsWithResource = await Promise.all(
        bookingsData.map(async (b) => {
          try {
            if (b.resourceId) {
              const resourceRes = await ResourceService.getResourceById(b.resourceId);
              return {
                ...b,
                resourceName: resourceRes?.data?.name || `Resource ${b.resourceId}`,
              };
            }

            return { ...b, resourceName: 'N/A' };
          } catch (err) {
            return { ...b, resourceName: `Resource ${b.resourceId || 'N/A'}` };
          }
        })
      );

      setBookings(bookingsWithResource);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...bookings];

    if (statusFilter !== 'ALL') {
      data = data.filter((b) => b.status === statusFilter);
    }

    if (dateFilter) {
      data = data.filter((b) => {
        if (!b.startTime) return false;
        const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
        return bookingDate === dateFilter;
      });
    }

    setFiltered(data);
  };

  const renderStatusBadge = (status) => {
    let color = '#555';
    let bg = '#f1f1f1';

    switch (status) {
      case 'PENDING':
        color = '#b26a00';
        bg = '#fff3cd';
        break;
      case 'APPROVED':
        color = '#217a36';
        bg = '#d4edda';
        break;
      case 'REJECTED':
        color = '#a71d2a';
        bg = '#f8d7da';
        break;
      case 'CANCELLED':
        color = '#555';
        bg = '#e2e3e5';
        break;
      default:
        break;
    }

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '14px',
          fontWeight: 700,
          color,
          background: bg,
          fontSize: '0.9rem',
          letterSpacing: 1,
          minWidth: 90,
          textAlign: 'center',
        }}
      >
        {status}
      </span>
    );
  };

  const formatBookingTime = (startTime, endTime) => {
    try {
      const startDateObj = new Date(startTime);
      const endDateObj = new Date(endTime);

      if (isNaN(startDateObj) || isNaN(endDateObj)) {
        return `${startTime} - ${endTime}`;
      }

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const formatTime = (d) => {
        let h = d.getHours();
        const m = d.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      return `${startDateObj.getDate()} ${months[startDateObj.getMonth()]} ${startDateObj.getFullYear()}, ${formatTime(startDateObj)} - ${formatTime(endDateObj)}`;
    } catch (err) {
      return `${startTime} - ${endTime}`;
    }
  };

  const openApproveConfirm = (id) => {
    setApproveId(id);
    setShowApproveConfirm(true);
  };

  const handleApprove = async () => {
    if (!approveId) return;

    try {
      await axios.put(`${API_URL}/${approveId}/approve`);
      setShowApproveConfirm(false);
      setApproveId(null);
      fetchBookings();
    } catch (err) {
      alert('Failed to approve booking');
    }
  };

  const openRejectModal = (id) => {
    setRejectId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectId) return;

    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }

    try {
      await axios.put(`${API_URL}/${rejectId}/reject`, { reason: rejectReason });
      setShowRejectModal(false);
      setRejectId(null);
      setRejectReason('');
      fetchBookings();
    } catch (err) {
      alert('Failed to reject booking');
    }
  };

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'PENDING').length;
  const approved = bookings.filter((b) => b.status === 'APPROVED').length;
  const rejected = bookings.filter((b) => b.status === 'REJECTED').length;

  return (
    <div style={{ maxWidth: 1200, margin: '2.5rem auto', fontFamily: 'inherit', background: '#f8fafc', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', padding: '2.5rem 2rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e3656', marginBottom: 6, letterSpacing: 0.5 }}>Admin Bookings</h1>
        <div style={{ color: '#718096', fontSize: 17, fontWeight: 500 }}>Manage, review, and take action on all resource bookings</div>
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
      {/* Filter Toolbar */}

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(99,179,237,0.04)', padding: '1rem 1.5rem', marginBottom: 30, flexWrap: 'wrap', border: '1.5px solid #e3e8ee' }}>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ccc' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(99,179,237,0.04)', padding: '1.7rem 1.2rem', border: '1.5px solid #e3e8ee' }}>
        <h3 style={{ marginBottom: 20, fontWeight: 800, fontSize: 22, color: '#1e3656', letterSpacing: 0.2 }}>All Bookings</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div>No bookings found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f7f7fa' }}>
                <th style={{ ...thStyle, minWidth: 80 }}>ID</th>
                <th style={{ ...thStyle, minWidth: 120 }}>Resource</th>
                <th style={{ ...thStyle, minWidth: 80 }}>User</th>
                <th style={{ ...thStyle, minWidth: 120 }}>Start Time</th>
                <th style={{ ...thStyle, minWidth: 120 }}>End Time</th>
                <th style={{ ...thStyle, minWidth: 120 }}>Purpose</th>
                <th style={{ ...thStyle, minWidth: 100 }}>Status</th>
                <th style={{ ...thStyle, minWidth: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={{ transition: 'background 0.18s', cursor: 'pointer' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#6c63ff', fontSize: 14 }} title={b.id}>{b.id ? `...${b.id.slice(-6)}` : ''}</td>
                  <td style={tdStyle}>{b.resourceName}</td>
                  <td style={tdStyle}>{b.userId}</td>
                  <td style={tdStyle}>{formatDateTime(b.startTime)}</td>
                  <td style={tdStyle}>{formatDateTime(b.endTime)}</td>
                  <td style={tdStyle}>{b.purpose}</td>
                  <td style={tdStyle}>{renderStatusBadge(b.status)}</td>
                  <td style={tdStyle}>
                    {b.status === 'PENDING' ? (
                      <>
                        <button onClick={() => openApproveConfirm(b.id)} style={{ background: '#217a36', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, marginRight: 8, cursor: 'pointer', fontSize: 15, boxShadow: '0 1px 4px rgba(33,122,54,0.07)' }}>Approve</button>
                        <button onClick={() => openRejectModal(b.id)} style={{ background: '#a71d2a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 15, boxShadow: '0 1px 4px rgba(167,29,42,0.07)' }}>Reject</button>
                      </>
                    ) : (
                      <span style={{ color: '#bbb', fontWeight: 500 }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showApproveConfirm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: 12, fontSize: '1.3rem', color: '#217a36' }}>Approve Booking</h3>
            <div style={{ marginBottom: 18 }}>Are you sure you want to approve this booking?</div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={() => {
                  setShowApproveConfirm(false);
                  setApproveId(null);
                }}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>

              <button onClick={handleApprove} style={approveButtonStyle}>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: 12, fontSize: '1.3rem', color: '#a71d2a' }}>Reject Booking</h3>
            <div style={{ marginBottom: 12 }}>Enter reason for rejection:</div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                borderRadius: 6,
                border: '1px solid #bbb',
                padding: 10,
                marginBottom: 18,
                resize: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectId(null);
                  setRejectReason('');
                }}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>

              <button onClick={handleReject} style={rejectButtonStyle}>
                Reject
              </button>
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

const approveButtonStyle = {
  background: '#217a36',
  color: '#fff',
  border: 'none',
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
};

export default AdminBookings;
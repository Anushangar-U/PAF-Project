import React, { useState, useEffect } from "react";
import axios from "axios";

const TEMP_USER_ID = 1;

const BookingFormModal = ({ onClose, onBooked }) => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9091/api/resources")
      .then((res) => setResources(res.data))
      .catch(() => setResources([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const startTime = `${form.date}T${form.startTime}`;
      const endTime = `${form.date}T${form.endTime}`;
      await axios.post("http://localhost:9091/api/bookings", {
        userId: TEMP_USER_ID,
        resourceId: form.resourceId,
        startTime,
        endTime,
        purpose: form.purpose,
        attendees: form.attendees,
      });
      onClose();
      onBooked(); // Refresh MyBookings list
    } catch (err) {
      const errMsg = err.response?.data;
      if (typeof errMsg === 'string' && errMsg.includes("conflict")) {
        setError("Time slot already booked!");
      } else if (typeof errMsg === 'string') {
        setError(errMsg);
      } else {
        setError("Error creating booking");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        width: '420px', maxWidth: '95vw', padding: '2.2rem 2.2rem 1.5rem 2.2rem', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch'
      }}>
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: '#b71c1c', marginBottom: 8, textAlign: 'center', letterSpacing: 0.2
        }}>Book a Resource</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ marginBottom: 2 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Resource</label>
            <select
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15 }}
            >
              <option value="">Select Resource</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 2 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Purpose</label>
            <input
              type="text"
              name="purpose"
              placeholder="Enter booking purpose"
              value={form.purpose}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Start Date & Time</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15, marginBottom: 6 }}
              />
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>End Date & Time</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15, marginBottom: 6 }}
              />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 2 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Expected Attendees</label>
            <input
              type="number"
              name="attendees"
              placeholder="e.g. 10"
              value={form.attendees}
              onChange={handleChange}
              required
              min="1"
              style={{ width: '100%', padding: 10, borderRadius: 7, border: '1px solid #ccc', fontSize: 15 }}
            />
          </div>
          {error && <div style={{ color: '#b71c1c', background: '#fff3f3', borderRadius: 6, padding: '8px 12px', fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
            <button
              type="button"
              style={{ background: '#eee', color: '#333', border: '1px solid #bbb', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(198,40,40,0.08)' }}
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;

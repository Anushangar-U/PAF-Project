import React, { useState, useEffect } from "react";
import axios from "axios";

const TEMP_USER_ID = 1;

const BookingFormModal = ({ onClose, onBooked, booking }) => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: booking?.resourceId || "",
    date: booking?.startTime ? booking.startTime.split('T')[0] : "",
    startTime: booking?.startTime ? booking.startTime.split('T')[1]?.slice(0,5) : "",
    endTime: booking?.endTime ? booking.endTime.split('T')[1]?.slice(0,5) : "",
    purpose: booking?.purpose || "",
    attendees: booking?.attendees || "",
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
      if (booking && booking.id) {
        // Edit mode: update booking
        await axios.put(`http://localhost:9091/api/bookings/${booking.id}`, {
          userId: TEMP_USER_ID,
          resourceId: form.resourceId,
          startTime,
          endTime,
          purpose: form.purpose,
          attendees: form.attendees,
        });
      } else {
        // Create mode: new booking
        await axios.post("http://localhost:9091/api/bookings", {
          userId: TEMP_USER_ID,
          resourceId: form.resourceId,
          startTime,
          endTime,
          purpose: form.purpose,
          attendees: form.attendees,
        });
      }
      onClose();
      onBooked(); // Refresh MyBookings list
    } catch (err) {
      const errMsg = err.response?.data;
      if (typeof errMsg === 'string' && errMsg.includes("conflict")) {
        setError("Time slot already booked!");
      } else if (typeof errMsg === 'string') {
        setError(errMsg);
      } else {
        setError(booking ? "Error updating booking" : "Error creating booking");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mybookings-overlay">
      <div className="mybookings-modal">
        <h3 className="modal-title">{booking ? 'Edit Booking' : 'Book a Resource'}</h3>
        <form className="booking-form styled-booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="resourceId">Resource</label>
            <select
              id="resourceId"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              required
            >
              <option value="">Select Resource</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
            <input
              id="purpose"
              type="text"
              name="purpose"
              placeholder="Purpose"
              value={form.purpose}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="attendees">Attendees</label>
            <input
              id="attendees"
              type="number"
              name="attendees"
              placeholder="Attendees"
              value={form.attendees}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          {error && <div className="mybookings-error">{error}</div>}
          <div className="modal-actions">
            <button
              type="button"
              className="action-button secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-button approve"
              disabled={submitting}
            >
              {submitting ? (booking ? "Saving..." : "Booking...") : (booking ? "Save Changes" : "Book Now")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;

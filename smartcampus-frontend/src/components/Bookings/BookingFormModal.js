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
    <div className="mybookings-overlay">
      <div className="mybookings-modal">
        <h3 className="modal-title">Book a Resource</h3>
        <form className="booking-form" onSubmit={handleSubmit}>
          <select
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
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="purpose"
            placeholder="Purpose"
            value={form.purpose}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="attendees"
            placeholder="Attendees"
            value={form.attendees}
            onChange={handleChange}
            required
            min="1"
          />
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
              {submitting ? "Booking..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;

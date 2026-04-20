import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaCalendarAlt, FaClock, FaUsers, FaBookmark, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from "../../hooks/useAuth";
import './BookingFormModal.css';

const API_URL = "http://localhost:9091/api";
const TEMP_USER_ID = 1;

const BookingFormModal = ({ onClose, onBooked, booking, resource, preSelectedResource }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: booking?.resourceId || resource?.id || preSelectedResource?.id || "",
    date: booking?.startTime ? booking.startTime.split('T')[0] : "",
    startTime: booking?.startTime ? booking.startTime.split('T')[1]?.slice(0,5) : "",
    endTime: booking?.endTime ? booking.endTime.split('T')[1]?.slice(0,5) : "",
    purpose: booking?.purpose || "",
    attendees: booking?.attendees || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch all resources
  useEffect(() => {
    axios
      .get(`${API_URL}/resources`)
      .then((res) => setResources(res.data))
      .catch(() => setResources([]));
  }, []);

  // Pre-fill resource if passed
  useEffect(() => {
    const selectedResource = resource || preSelectedResource;
    if (selectedResource && !booking) {
      setForm(prev => ({
        ...prev,
        resourceId: selectedResource.id
      }));
    }
  }, [resource, preSelectedResource, booking]);

  // Fetch booked slots when resource and date are selected
  useEffect(() => {
    if (!form.resourceId || !form.date) {
      setBookedSlots([]);
      return;
    }
    setLoadingSlots(true);
    axios
      .get(`${API_URL}/bookings/resource/${form.resourceId}/slots`, {
        params: { date: form.date },
      })
      .then((res) => setBookedSlots(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.resourceId, form.date]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validation: start time must be in future
    if (form.date && form.startTime) {
      const selected = new Date(`${form.date}T${form.startTime}:00`);
      if (selected < new Date()) {
        setError("Start time is in the past. Please select a future date and time.");
        setSubmitting(false);
        return;
      }
    }

    // Validation: end time must be after start time
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      setSubmitting(false);
      return;
    }

    const userId = user?.id || user?.userId || TEMP_USER_ID;

    const bookingData = {
      userId,
      resourceId: form.resourceId,
      startTime: `${form.date}T${form.startTime}:00`,
      endTime: `${form.date}T${form.endTime}:00`,
      purpose: form.purpose,
      attendees: parseInt(form.attendees) || 1
    };

    try {
      if (booking?.id) {
        await axios.put(`${API_URL}/bookings/${booking.id}`, bookingData);
      } else {
        await axios.post(`${API_URL}/bookings`, bookingData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        onBooked();
      }, 1500);
    } catch (err) {
      console.error("Error:", err.response?.data);
      const data = err.response?.data;
      let msg = "Failed to submit booking. Please try a different time slot.";
      if (err.response?.status === 409) {
        msg = "This time slot is already booked. Please choose another time.";
      } else if (err.response?.status === 400) {
        msg = "Invalid booking data. Please check all fields.";
      } else if (typeof data === "string" && data) {
        msg = data;
      } else if (data && typeof data === "object") {
        msg = String(data.message || data.error || msg);
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedResourceData = resources.find(r => r.id === form.resourceId);
  const displayResource = resource || preSelectedResource || selectedResourceData;

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const conflicting = form.startTime && form.endTime && bookedSlots.some(
    (slot) => form.startTime < slot.endTime && form.endTime > slot.startTime
  );

  // Success Screen
  if (success) {
    return (
      <div className="booking-modal-overlay">
        <div className="booking-modal success-modal">
          <div className="success-animation">
            <FaCheckCircle className="success-icon" />
          </div>
          <h2>Booking Request Sent!</h2>
          <p>Your request has been submitted for approval.</p>
          <p className="success-note">You'll be notified once it's processed.</p>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-header">
          <div className="modal-header-icon">
            <FaBookmark />
          </div>
          <h2>{booking ? 'Edit Booking' : 'Request Resource'}</h2>
          <p className="modal-subtitle">
            {displayResource 
              ? `You're requesting: ${displayResource.name}`
              : 'Fill in the details to request a resource'}
          </p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          {/* Resource Selection */}
          {!displayResource && (
            <div className="form-field">
              <label htmlFor="resourceId">
                <FaBookmark className="field-icon" />
                Select Resource
              </label>
              <select
                id="resourceId"
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Choose a resource...</option>
                {resources
                  .filter(r => r.status === 'ACTIVE')
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} • {r.type} • Capacity: {r.capacity}
                    </option>
                  ))}
              </select>
            </div>
          )}
          
          {/* Selected Resource Display */}
          {displayResource && (
            <div className="selected-resource-card">
              <div className="resource-card-icon">
                <FaBookmark />
              </div>
              <div className="resource-card-details">
                <h3>{displayResource.name}</h3>
                <span className="resource-badge">{displayResource.type}</span>
                <div className="resource-meta">
                  <span>📍 {displayResource.location}</span>
                  <span>👥 Capacity: {displayResource.capacity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="date">
                <FaCalendarAlt className="field-icon" />
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={today}
                className="form-input"
              />
            </div>
          </div>

          {/* Availability Panel */}
          {form.resourceId && form.date && (
            <div className="availability-panel">
              <p className="availability-title">
                📅 Availability · {form.date}
              </p>
              {loadingSlots ? (
                <p className="availability-loading">Checking availability…</p>
              ) : bookedSlots.length === 0 ? (
                <p className="availability-available">✅ All slots are available</p>
              ) : (
                <div className="booked-slots-list">
                  {bookedSlots.map((slot, i) => (
                    <span key={i} className="booked-slot-badge">
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Time Selection */}
          <div className="form-row two-col">
            <div className="form-field">
              <label htmlFor="startTime">
                <FaClock className="field-icon" />
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label htmlFor="endTime">
                <FaClock className="field-icon" />
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Conflict Warning */}
          {conflicting && (
            <div className="conflict-warning">
              ⚠️ This time overlaps with an existing booking. Please choose a different slot.
            </div>
          )}

          {/* Purpose */}
          <div className="form-field">
            <label htmlFor="purpose">
              <FaBookmark className="field-icon" />
              Purpose
            </label>
            <input
              id="purpose"
              type="text"
              name="purpose"
              placeholder="e.g., Lab session, Group study, Meeting..."
              value={form.purpose}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* Attendees */}
          <div className="form-field">
            <label htmlFor="attendees">
              <FaUsers className="field-icon" />
              Number of Attendees
            </label>
            <input
              id="attendees"
              type="number"
              name="attendees"
              placeholder="Enter number of attendees"
              value={form.attendees}
              onChange={handleChange}
              required
              min="1"
              max="500"
              className="form-input"
            />
            {selectedResourceData && form.attendees > selectedResourceData.capacity && (
              <span className="field-warning">
                ⚠️ Exceeds resource capacity ({selectedResourceData.capacity})
              </span>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <FaTimes className="error-icon" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || conflicting}
            >
              {submitting ? (
                <>
                  <span className="spinner-small"></span>
                  {booking ? "Saving..." : "Submitting..."}
                </>
              ) : (
                booking ? 'Save Changes' : 'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
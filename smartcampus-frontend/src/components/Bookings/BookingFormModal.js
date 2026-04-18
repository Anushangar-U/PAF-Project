import React, { useState, useEffect } from "react";
import axios from "axios";

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
    // HARDCODED TEST DATA
    const testBooking = {
      userId: 1,
      resourceId: "69e36b3a6b86353359944344", // Computer Lab 101
      startTime: "2026-04-20T10:00:00",
      endTime: "2026-04-20T11:00:00",
      purpose: "Test booking",
      attendees: 5
    };
    
    console.log("Sending test booking:", testBooking);
    await axios.post("http://localhost:9091/api/bookings", testBooking);
    
    alert("Test booking created!");
    onClose();
    onBooked();
  } catch (err) {
    console.error("Error:", err.response?.data);
    setError(err.response?.data || "Failed to create booking");
  } finally {
    setSubmitting(false);
  }
};
  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-lg border p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-slate-900 mb-4">{booking ? 'Edit Booking' : 'Book a Resource'}</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="resourceId" className="text-sm font-medium leading-none text-slate-700">Resource *</label>
            <select
              id="resourceId"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select Resource</option>
              {resources
                .filter(r => r.status === 'ACTIVE')
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type})
                  </option>
                ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="date" className="text-sm font-medium leading-none text-slate-700">Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              min={today}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <label htmlFor="startTime" className="text-sm font-medium leading-none text-slate-700">Start Time *</label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <label htmlFor="endTime" className="text-sm font-medium leading-none text-slate-700">End Time *</label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="purpose" className="text-sm font-medium leading-none text-slate-700">Purpose *</label>
            <input
              id="purpose"
              type="text"
              name="purpose"
              placeholder="e.g., Lab session, Group study"
              value={form.purpose}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="attendees" className="text-sm font-medium leading-none text-slate-700">Number of Attendees *</label>
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
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          {error && <div className="text-sm font-medium text-destructive">{error}</div>}
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-slate-50 h-10 px-4 py-2 transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2 transition-colors disabled:opacity-50"
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
import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const API_URL = "http://localhost:9091/api";

/* ── shadcn-style input class ─────────────────────────────────────── */
const inputClass = [
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1",
  "text-sm shadow-sm transition-colors",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const Field = ({ label, htmlFor, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none text-foreground"
    >
      {label}
    </label>
    {children}
  </div>
);

/* ── component ────────────────────────────────────────────────────── */
const BookingFormModal = ({ onClose, onBooked, booking, preSelectedResource }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: preSelectedResource?.id || booking?.resourceId || "",
    date: booking?.startTime ? booking.startTime.split("T")[0] : "",
    startTime: booking?.startTime ? booking.startTime.split("T")[1]?.slice(0, 5) : "",
    endTime: booking?.endTime ? booking.endTime.split("T")[1]?.slice(0, 5) : "",
    purpose: booking?.purpose || "",
    attendees: booking?.attendees || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/resources`)
      .then((res) => setResources(res.data))
      .catch(() => setResources([]));
  }, []);

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

    // Frontend validation: reject past start times
    if (form.date && form.startTime) {
      const selected = new Date(`${form.date}T${form.startTime}:00`);
      if (selected < new Date()) {
        setError("Start time is in the past. Please select a future date and time.");
        setSubmitting(false);
        return;
      }
    }

    // Frontend validation: end must be after start
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      setSubmitting(false);
      return;
    }

    const userId = user?.id || user?.userId || 1;

    const payload = {
      userId,
      resourceId: form.resourceId,
      startTime: `${form.date}T${form.startTime}:00`,
      endTime: `${form.date}T${form.endTime}:00`,
      purpose: form.purpose,
      attendees: Number(form.attendees),
    };

    try {
      if (booking?.id) {
        await axios.put(`${API_URL}/bookings/${booking.id}`, payload);
      } else {
        await axios.post(`${API_URL}/bookings`, payload);
      }
      onBooked();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      let msg = "Failed to submit booking. Please try a different time slot.";
      if (typeof data === "string" && data) msg = data;
      else if (data && typeof data === "object") {
        msg = String(data.message || data.error || msg);
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const conflicting =
    !!form.startTime &&
    !!form.endTime &&
    bookedSlots.some(
      (slot) => form.startTime < slot.endTime && form.endTime > slot.startTime
    );

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/*
        Mobile  → bottom sheet: full width, rounded top corners
        sm+     → centered card: max-w-lg, fully rounded
      */}
      <div className="relative w-full sm:max-w-lg sm:mx-4 bg-background border border-border rounded-t-lg sm:rounded-lg shadow-lg flex flex-col max-h-[92dvh] sm:max-h-[90dvh]">

        {/* Drag handle — mobile only */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted sm:hidden" />

        {/* ── Header (outside form, never scrolls) ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">
              {booking ? "Edit Booking" : "Book a Resource"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {booking
                ? "Update the details below."
                : "Fill in the details to request a resource."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ml-4 mt-0.5"
            aria-label="Close"
          >
            <X size={18} className="text-foreground" />
          </button>
        </div>

        <div className="border-t border-border" />

        {/* ── Form wraps scrollable body + footer ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">

          {/* Scrollable fields */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

            {/* Resource */}
            <Field label="Resource *" htmlFor="resourceId">
              <select
                id="resourceId"
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select a resource…</option>
                {resources
                  .filter((r) => r.status === "ACTIVE")
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.type})
                    </option>
                  ))}
              </select>
            </Field>

            {/* Date */}
            <Field label="Date *" htmlFor="date">
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={today}
                className={inputClass}
              />
            </Field>

            {/* Real-time availability panel */}
            {form.resourceId && form.date && (
              <div className="rounded-md border border-border bg-muted px-3 py-2.5 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Availability · {form.date}
                </p>
                {loadingSlots ? (
                  <p className="text-xs text-muted-foreground">Checking availability…</p>
                ) : bookedSlots.length === 0 ? (
                  <p className="text-xs font-medium text-foreground">All slots are available</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {bookedSlots.map((slot, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-[11px] font-semibold text-destructive"
                      >
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Start / End time — stacked on mobile, side-by-side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Start Time *" htmlFor="startTime">
                <input
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="End Time *" htmlFor="endTime">
                <input
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Conflict warning */}
            {conflicting && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
                This time overlaps with an existing booking. Please choose a different slot.
              </div>
            )}

            {/* Purpose */}
            <Field label="Purpose *" htmlFor="purpose">
              <input
                id="purpose"
                type="text"
                name="purpose"
                placeholder="e.g., Lab session, Group study"
                value={form.purpose}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>

            {/* Attendees */}
            <Field label="Number of Attendees *" htmlFor="attendees">
              <input
                id="attendees"
                type="number"
                name="attendees"
                placeholder="1 – 500"
                value={form.attendees}
                onChange={handleChange}
                required
                min="1"
                max="500"
                className={inputClass}
              />
            </Field>

            {/* General error */}
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* ── Footer (inside form so submit works, never scrolls) ── */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 shrink-0">
            {/* Cancel — outline variant */}
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Cancel
            </button>
            {/* Submit — primary (default) variant */}
            <button
              type="submit"
              disabled={submitting || conflicting}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {submitting
                ? booking ? "Saving…" : "Booking…"
                : booking ? "Save Changes" : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;

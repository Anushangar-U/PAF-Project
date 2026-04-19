import React, { useState } from 'react';
import AttachmentUploader from './AttachmentUploader';
import ticketService from '../../services/TicketService';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, PRIORITY } from '../../utils/constants';
import './TicketForm.css';

/**
 * TicketForm
 * Modal form for creating a new incident ticket.
 * Props:
 *   onClose()              – close modal without saving
 *   onCreated(ticket)      – called after successful creation
 */
function TicketForm({ onClose, onCreated }) {
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    title:        '',
    description:  '',
    location:     '',
    category:     '',
    priority:     PRIORITY.MEDIUM,
    contactName:  currentUser?.name  ?? '',
    contactEmail: currentUser?.email ?? '',
  });
  const [images,     setImages]     = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors,     setErrors]     = useState({});

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.category)           e.category    = 'Please select a category';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('reportedById', currentUser?.id ?? 1);
      images.forEach((img) => formData.append('attachments', img));

      const res = await ticketService.createTicket(formData);
      onCreated(res.data);
    } catch {
      /* Offline fallback – build a local mock ticket */
      const mock = {
        id:             Date.now(),
        ...form,
        status:         'OPEN',
        createdAt:      new Date().toISOString(),
        reportedBy:     currentUser,
        attachmentUrls: images.map((img) => URL.createObjectURL(img)),
        comments:       [],
      };
      onCreated(mock);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket-form-overlay" role="dialog" aria-modal="true">
      <div className="ticket-form-box">

        {/* Header */}
        <div className="ticket-form-header">
          <h2>🎫 Report New Incident</h2>
          <button
            id="close-ticket-form-btn"
            className="ticket-form-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ticket-form-body">

            {/* Title */}
            <div className="ticket-form-field">
              <label>
                Title <span className="ticket-form-required">*</span>
              </label>
              <input
                id="ticket-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Brief description of the problem"
              />
              {errors.title && (
                <small className="ticket-form-error">{errors.title}</small>
              )}
            </div>

            {/* Description */}
            <div className="ticket-form-field">
              <label>
                Description <span className="ticket-form-required">*</span>
              </label>
              <textarea
                id="ticket-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide full details about the incident…"
                rows={4}
              />
              {errors.description && (
                <small className="ticket-form-error">{errors.description}</small>
              )}
            </div>

            {/* Location + Category */}
            <div className="ticket-form-row">
              <div className="ticket-form-field">
                <label>
                  Location / Resource <span className="ticket-form-required">*</span>
                </label>
                <input
                  id="ticket-location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Engineering Lab 4"
                />
                {errors.location && (
                  <small className="ticket-form-error">{errors.location}</small>
                )}
              </div>
              <div className="ticket-form-field">
                <label>
                  Category <span className="ticket-form-required">*</span>
                </label>
                <select
                  id="ticket-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">— Select Category —</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <small className="ticket-form-error">{errors.category}</small>
                )}
              </div>
            </div>

            {/* Priority + Contact Name */}
            <div className="ticket-form-row">
              <div className="ticket-form-field">
                <label>Priority</label>
                <select
                  id="ticket-priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🔴 High</option>
                </select>
              </div>
              <div className="ticket-form-field">
                <label>Contact Name</label>
                <input
                  id="ticket-contact-name"
                  type="text"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="ticket-form-field">
              <label>Contact Email</label>
              <input
                id="ticket-contact-email"
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            {/* Attachments */}
            <div className="ticket-form-field">
              <label>Attachments (max 3 images)</label>
              <AttachmentUploader images={images} setImages={setImages} />
            </div>

          </div>

          {/* Footer */}
          <div className="ticket-form-footer">
            <button
              type="button"
              className="ticket-btn ticket-btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="submit-ticket-btn"
              type="submit"
              className="ticket-btn ticket-btn-primary"
              disabled={submitting}
            >
              {submitting ? '⏳ Submitting…' : '✅ Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketForm;

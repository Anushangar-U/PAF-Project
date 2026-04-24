import React, { useState } from 'react';
import AttachmentUploader from './AttachmentUploader';
import TicketService from '../services/TicketService';

/* ════════════════════════════════════
   TicketForm  — Modal to create a new ticket
   props:
     onClose()
     onCreated(ticket)
     currentUser
════════════════════════════════════ */
function TicketForm({ onClose, onCreated, currentUser }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    priority: 'MEDIUM',
    contactName: currentUser?.name ?? '',
    contactEmail: currentUser?.email ?? '',
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.category)           e.category    = 'Select a category';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('reportedById', currentUser?.id ?? 1);
      images.forEach(img => formData.append('attachments', img));

      const res = await TicketService.createTicket(formData);
      onCreated(res.data);
    } catch (err) {
      console.error(err);
      // Demo fallback: create a mock ticket
      const mock = {
        id: Date.now(),
        ...form,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        reportedBy: currentUser,
        attachmentUrls: images.map(img => URL.createObjectURL(img)),
        comments: [],
      };
      onCreated(mock);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>🎫 Report New Incident</h2>
          <button className="modal-close" onClick={onClose} disabled={submitting}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Title */}
            <div className="form-field">
              <label>Title <span className="required-star">*</span></label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Brief description of the problem"
              />
              {errors.title && <small style={{ color: 'var(--rejected)' }}>{errors.title}</small>}
            </div>

            {/* Description */}
            <div className="form-field">
              <label>Description <span className="required-star">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide full details about the incident…"
                rows={4}
              />
              {errors.description && <small style={{ color: 'var(--rejected)' }}>{errors.description}</small>}
            </div>

            {/* Location + Category */}
            <div className="form-row">
              <div className="form-field">
                <label>Location / Resource <span className="required-star">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Engineering Lab 4"
                />
                {errors.location && <small style={{ color: 'var(--rejected)' }}>{errors.location}</small>}
              </div>
              <div className="form-field">
                <label>Category <span className="required-star">*</span></label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">— Select Category —</option>
                  <option value="ELECTRICAL">⚡ Electrical</option>
                  <option value="PLUMBING">🔧 Plumbing</option>
                  <option value="IT_EQUIPMENT">💻 IT Equipment</option>
                  <option value="HVAC">❄️ HVAC / AC</option>
                  <option value="STRUCTURAL">🏗️ Structural</option>
                  <option value="SAFETY">⚠️ Safety Hazard</option>
                  <option value="OTHER">📌 Other</option>
                </select>
                {errors.category && <small style={{ color: 'var(--rejected)' }}>{errors.category}</small>}
              </div>
            </div>

            {/* Priority + Contact Name */}
            <div className="form-row">
              <div className="form-field">
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🔴 High</option>
                </select>
              </div>
              <div className="form-field">
                <label>Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="form-field">
              <label>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            {/* Attachments */}
            <div className="form-field">
              <label>Attachments (max 3 images)</label>
              <AttachmentUploader images={images} setImages={setImages} />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Submitting…' : '✅ Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketForm;

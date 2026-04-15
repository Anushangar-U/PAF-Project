import React, { useState } from 'react';
import TicketService from '../services/TicketService';

/* ════════════════════════════════════
   TechnicianPanel
   Visible only to TECHNICIAN / ADMIN roles.
   Allows updating status and adding resolution notes.
   props:
     ticket    – ticket object
     onUpdated(updatedTicket)
════════════════════════════════════ */

/* Status transition rules (mirrors backend) */
const ALLOWED_TRANSITIONS = {
  OPEN:        ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'OPEN'],
  RESOLVED:    ['CLOSED', 'IN_PROGRESS'],
  CLOSED:      [],
  REJECTED:    [],
};

function TechnicianPanel({ ticket, onUpdated }) {
  const [newStatus, setNewStatus]       = useState(ticket.status);
  const [notes, setNotes]               = useState(ticket.resolutionNotes ?? '');
  const [technician, setTechnician]     = useState(ticket.assignedTechnician ?? '');
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  const allowed = ALLOWED_TRANSITIONS[ticket.status] ?? [];

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        status: newStatus,
        resolutionNotes: notes,
        assignedTechnician: technician,
      };
      const res = await TicketService.updateTicketStatus(ticket.id, payload);
      onUpdated(res.data);
    } catch {
      // Offline fallback
      onUpdated({ ...ticket, status: newStatus, resolutionNotes: notes, assignedTechnician: technician });
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [ticket.status, ...allowed];

  return (
    <div className="technician-panel">
      <h4>🛠️ Technician Panel</h4>

      <div className="form-group">
        <label className="form-label">Update Status</label>
        <select
          className="form-select"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        {allowed.length === 0 && (
          <small style={{ color: 'var(--text-lite)', fontSize: 11 }}>
            No further transitions available.
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Assigned Technician</label>
        <input
          className="form-input"
          type="text"
          value={technician}
          onChange={e => setTechnician(e.target.value)}
          placeholder="Technician name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Resolution Notes</label>
        <textarea
          className="form-input"
          style={{ resize: 'vertical', minHeight: 80 }}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add resolution details or work log…"
        />
      </div>

      {error && <small style={{ color: 'var(--rejected)' }}>{error}</small>}

      <button
        className="btn btn-primary"
        style={{ width: '100%' }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? '⏳ Saving…' : '💾 Save Changes'}
      </button>
    </div>
  );
}

export default TechnicianPanel;

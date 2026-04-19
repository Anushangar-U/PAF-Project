import React, { useState } from 'react';
import StatusUpdater  from './StatusUpdater';
import ResolutionForm from './ResolutionForm';
import ticketService  from '../../services/TicketService';

/**
 * TechnicianPanel
 * Visible only to TECHNICIAN / ADMIN roles.
 * Composes StatusUpdater + ResolutionForm.
 * Props:
 *   ticket      – ticket object
 *   onUpdated   – (updatedTicket) => void
 */
function TechnicianPanel({ ticket, onUpdated }) {
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [resolution, setResolution] = useState({
    technician:      ticket.assignedTechnician ?? '',
    resolutionNotes: ticket.resolutionNotes    ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        status:             newStatus,
        resolutionNotes:    resolution.resolutionNotes,
        assignedTechnician: resolution.technician,
      };
      const res = await ticketService.updateTicketStatus(ticket.id, payload);
      onUpdated(res.data);
    } catch {
      /* Offline fallback – merge locally */
      onUpdated({
        ...ticket,
        status:             newStatus,
        resolutionNotes:    resolution.resolutionNotes,
        assignedTechnician: resolution.technician,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="technician-panel">
      <h4>🛠️ Technician Panel</h4>

      {/* Status transition dropdown */}
      <StatusUpdater
        currentStatus={newStatus}
        onStatusChange={setNewStatus}
      />

      {/* Technician name + resolution notes */}
      <ResolutionForm
        technician={resolution.technician}
        resolutionNotes={resolution.resolutionNotes}
        onChange={setResolution}
      />

      {error && (
        <small style={{ color: 'var(--rejected)' }}>{error}</small>
      )}

      <button
        id="save-ticket-status-btn"
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

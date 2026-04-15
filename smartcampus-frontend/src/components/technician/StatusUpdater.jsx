import React, { useState } from 'react';
import { ALLOWED_TRANSITIONS } from '../../utils/constants';

/**
 * StatusUpdater
 * Dropdown that enforces valid status transitions.
 * Props:
 *   currentStatus   – string
 *   onStatusChange  – (newStatus: string) => void
 */
function StatusUpdater({ currentStatus, onStatusChange }) {
  const [value, setValue] = useState(currentStatus);

  const options = [currentStatus, ...(ALLOWED_TRANSITIONS[currentStatus] ?? [])];

  const handleChange = (e) => {
    setValue(e.target.value);
    onStatusChange(e.target.value);
  };

  return (
    <div className="form-group">
      <label className="form-label">Update Status</label>
      <select
        id="status-updater-select"
        className="form-select"
        value={value}
        onChange={handleChange}
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>
      {options.length === 1 && (
        <small style={{ color: 'var(--text-lite)', fontSize: 11 }}>
          No further transitions available for this ticket.
        </small>
      )}
    </div>
  );
}

export default StatusUpdater;

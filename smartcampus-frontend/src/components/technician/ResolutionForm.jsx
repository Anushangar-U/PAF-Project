import React, { useState } from 'react';

/**
 * ResolutionForm
 * Input fields for technician name and resolution notes.
 * Props:
 *   technician        – string (initial value)
 *   resolutionNotes   – string (initial value)
 *   onChange({ technician, resolutionNotes }) – called on any field change
 */
function ResolutionForm({ technician = '', resolutionNotes = '', onChange }) {
  const [tech,  setTech]  = useState(technician);
  const [notes, setNotes] = useState(resolutionNotes);

  const notify = (newTech, newNotes) =>
    onChange?.({ technician: newTech, resolutionNotes: newNotes });

  const handleTech = (e) => {
    setTech(e.target.value);
    notify(e.target.value, notes);
  };

  const handleNotes = (e) => {
    setNotes(e.target.value);
    notify(tech, e.target.value);
  };

  return (
    <>
      {/* Assigned technician */}
      <div className="form-group">
        <label className="form-label">Assigned Technician</label>
        <input
          id="resolution-technician"
          className="form-input"
          type="text"
          value={tech}
          onChange={handleTech}
          placeholder="Technician full name"
        />
      </div>

      {/* Resolution notes */}
      <div className="form-group">
        <label className="form-label">Resolution Notes</label>
        <textarea
          id="resolution-notes"
          className="form-input"
          style={{ resize: 'vertical', minHeight: 80 }}
          value={notes}
          onChange={handleNotes}
          placeholder="Describe the work done or current progress…"
        />
      </div>
    </>
  );
}

export default ResolutionForm;

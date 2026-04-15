import React from 'react';
import { STATUS_LABELS, PRIORITY_ICONS } from '../../utils/constants';

/**
 * TicketStatusBadge
 * Props: status  (OPEN | IN_PROGRESS | RESOLVED | CLOSED | REJECTED)
 */
export function TicketStatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/**
 * PriorityBadge
 * Props: priority (HIGH | MEDIUM | LOW)
 */
export function PriorityBadge({ priority }) {
  return (
    <span className={`badge badge-priority-${priority}`}>
      {PRIORITY_ICONS[priority]} {priority}
    </span>
  );
}

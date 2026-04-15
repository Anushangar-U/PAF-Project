import React from 'react';

/* ════════════════════════════════════
   TicketStatusBadge
   props: status  (OPEN | IN_PROGRESS | RESOLVED | CLOSED | REJECTED)
════════════════════════════════════ */
export function TicketStatusBadge({ status }) {
  const labels = {
    OPEN:        '🔵 Open',
    IN_PROGRESS: '🟡 In Progress',
    RESOLVED:    '🟢 Resolved',
    CLOSED:      '⚫ Closed',
    REJECTED:    '🔴 Rejected',
  };
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {labels[status] ?? status}
    </span>
  );
}

/* ════════════════════════════════════
   PriorityBadge
   props: priority (HIGH | MEDIUM | LOW)
════════════════════════════════════ */
export function PriorityBadge({ priority }) {
  const icons = { HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢' };
  return (
    <span className={`badge badge-priority-${priority}`}>
      {icons[priority]} {priority}
    </span>
  );
}

/* ════════════════════════════════════
   SLABadge – Urgency/SLA Status
   props: slaStatus (NORMAL | WARNING | CRITICAL | RESOLVED)
════════════════════════════════════ */
export function SLABadge({ slaStatus }) {
  const config = {
    NORMAL: { icon: '🟢', label: 'Normal', color: '#10b981' },
    WARNING: { icon: '🟡', label: 'Warning', color: '#f59e0b' },
    CRITICAL: { icon: '🔴', label: 'Critical', color: '#ef4444' },
    RESOLVED: { icon: '✅', label: 'Resolved', color: '#6b7280' },
  };
  const info = config[slaStatus] || config.NORMAL;
  return (
    <span
      className={`badge badge-sla-${slaStatus?.toLowerCase()}`}
      style={{ background: info.color + '20', color: info.color }}
      title={`SLA Status: ${info.label}`}
    >
      {info.icon} {info.label}
    </span>
  );
}


import React from 'react';
import { TicketStatusBadge, PriorityBadge } from './TicketStatusBadge';
import { CATEGORY_ICONS } from '../../utils/constants';

/**
 * TicketCard
 * A single row in the ticket list.
 * Props:
 *   ticket  – ticket object
 *   onClick – (ticket) => void
 */
function TicketCard({ ticket, onClick }) {
  const created = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

  return (
    <div
      className={`ticket-card priority-${ticket.priority}`}
      onClick={() => onClick(ticket)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(ticket)}
      aria-label={`Ticket ${ticket.id}: ${ticket.title}`}
    >
      <div className="ticket-main">
        <div className="ticket-header">
          <div>
            <div className="ticket-id">#{String(ticket.id).padStart(4, '0')}</div>
            <div className="ticket-title">{ticket.title}</div>
            <div className="ticket-description">{ticket.description}</div>
          </div>
        </div>

        <div className="ticket-meta">
          <span className="meta-chip">
            <span>📍</span> {ticket.location}
          </span>
          <span className="meta-chip">
            <span>{CATEGORY_ICONS[ticket.category] ?? '📌'}</span>{' '}
            {ticket.category?.replace('_', ' ')}
          </span>
          <span className="meta-chip">
            <span>🕒</span> {created}
          </span>
          {ticket.reportedBy?.name && (
            <span className="meta-chip">
              <span>👤</span> {ticket.reportedBy.name}
            </span>
          )}
        </div>
      </div>

      <div className="ticket-aside">
        <TicketStatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>
    </div>
  );
}

export default TicketCard;

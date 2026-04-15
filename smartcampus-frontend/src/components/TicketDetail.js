import React, { useState, useEffect } from 'react';
import { TicketStatusBadge, PriorityBadge, SLABadge } from './TicketStatusBadge';
import CommentList from './CommentList';
import TechnicianPanel from './TechnicianPanel';
import TicketService from '../services/TicketService';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../utils/constants';

/* ════════════════════════════════════
   Workflow indicator
════════════════════════════════════ */
const WORKFLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

function WorkflowIndicator({ status }) {
  const idx = WORKFLOW.indexOf(status);
  return (
    <div className="workflow-steps">
      {WORKFLOW.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        const cls    = done ? 'done' : active ? 'active' : '';
        return (
          <React.Fragment key={step}>
            <div className={`workflow-step ${cls}`}>
              <div className={`workflow-dot ${cls}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className="workflow-label">{step.replace('_',' ')}</span>
            </div>
            {i < WORKFLOW.length - 1 && (
              <div className={`workflow-line ${done ? 'done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════
   TicketDetail
   props: ticket (initial), onBack()
════════════════════════════════════ */
function TicketDetail({ ticket: initialTicket, onBack }) {
  const { currentUser } = useAuth();
  const [ticket,   setTicket]   = useState(initialTicket);
  const [comments, setComments] = useState(initialTicket.comments ?? []);
  const [loading,  setLoading]  = useState(false);

  const catIcons = {
    ELECTRICAL:'⚡', PLUMBING:'🔧', IT_EQUIPMENT:'💻',
    HVAC:'❄️', STRUCTURAL:'🏗️', SAFETY:'⚠️', OTHER:'📌',
  };

  /* Fetch fresh data */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tRes, cRes] = await Promise.all([
          TicketService.getTicketById(ticket.id),
          TicketService.getCommentsByTicket(ticket.id),
        ]);
        setTicket(tRes.data);
        setComments(cRes.data);
      } catch { /* use seed data */ } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id]);

  const date = (iso) =>
    iso
      ? new Date(iso).toLocaleString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : '—';

  const isTech = currentUser.role === 'TECHNICIAN' || currentUser.role === 'ADMIN';

  return (
    <div>
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← Back to Tickets
      </button>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-lite)', fontWeight: 600 }}>
              #{String(ticket.id).padStart(4, '0')}
            </div>
            <h2 className="ticket-detail-title">{ticket.title}</h2>
            <div className="ticket-detail-meta">
              <TicketStatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              {ticket.slaStatus && <SLABadge slaStatus={ticket.slaStatus} />}
              <span style={{ fontSize: 12, color: 'var(--text-lite)' }}>🕒 {date(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow */}
      {ticket.status !== 'REJECTED' && <WorkflowIndicator status={ticket.status} />}

      {/* 2-col layout */}
      <div className="detail-layout">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Info card */}
          <div className="detail-card">
            <div className="detail-card-header">
              <span className="detail-card-title">📋 Ticket Information</span>
            </div>
            <div className="detail-card-body">
              <div className="info-grid">
                <div className="info-item">
                  <label>Location / Resource</label>
                  <p>📍 {ticket.location}</p>
                </div>
                <div className="info-item">
                  <label>Category</label>
                  <p>{catIcons[ticket.category]} {ticket.category?.replace('_',' ')}</p>
                </div>
                <div className="info-item">
                  <label>Reported By</label>
                  <p>👤 {ticket.reportedBy?.name ?? '—'}</p>
                </div>
                <div className="info-item">
                  <label>Contact Email</label>
                  <p>✉️ {ticket.contactEmail ?? ticket.reportedBy?.email ?? '—'}</p>
                </div>
                <div className="info-item">
                  <label>Assigned Technician</label>
                  <p>🛠️ {ticket.assignedTechnician ?? 'Not assigned'}</p>
                </div>
                <div className="info-item">
                  <label>Last Updated</label>
                  <p>🕒 {date(ticket.updatedAt ?? ticket.createdAt)}</p>
                </div>
              </div>

              <div className="divider" />

              <div className="description-section">
                <h4>Description</h4>
                <p>{ticket.description}</p>
              </div>

              {ticket.resolutionNotes && (
                <>
                  <div className="divider" />
                  <div className="description-section">
                    <h4>Resolution Notes</h4>
                    <p style={{ color: 'var(--resolved)' }}>{ticket.resolutionNotes}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Attachments */}
          {ticket.attachmentUrls?.length > 0 && (
            <div className="detail-card">
              <div className="detail-card-header">
                <span className="detail-card-title">📎 Attachments ({ticket.attachmentUrls.length})</span>
              </div>
              <div className="detail-card-body">
                <div className="attachment-grid">
                  {ticket.attachmentUrls.map((url, i) => (
                    <img
                      key={i}
                      src={`${BACKEND_URL}${url}`}
                      alt={`Attachment ${i + 1}`}
                      className="attachment-thumb"
                      onClick={() => window.open(`${BACKEND_URL}${url}`, '_blank')}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="detail-card">
            <div className="detail-card-header">
              <span className="detail-card-title">💬 Comments ({comments.length})</span>
            </div>
            <div className="detail-card-body">
              {loading ? <div className="spinner" /> : (
                <CommentList
                  ticketId={ticket.id}
                  comments={comments}
                  onCommentAdded={c => setComments(prev => [...prev, c])}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="panel-section">

          {/* Ticket meta panel */}
          <div className="detail-card">
            <div className="detail-card-header">
              <span className="detail-card-title">🔖 Details</span>
            </div>
            <div className="detail-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="info-block">
                <label>Status</label>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className="info-block">
                <label>Priority</label>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="info-block">
                <label>SLA Status</label>
                {ticket.slaStatus ? <SLABadge slaStatus={ticket.slaStatus} /> : <p style={{ fontSize: 13 }}>—</p>}
              </div>
              <div className="info-block">
                <label>Created</label>
                <p style={{ fontSize: 13 }}>{date(ticket.createdAt)}</p>
              </div>
              <div className="info-block">
                <label>Category</label>
                <p style={{ fontSize: 13 }}>{ticket.category?.replace('_',' ')}</p>
              </div>
            </div>
          </div>

          {/* Technician panel (role-gated) */}
          {isTech && (
            <TechnicianPanel
              ticket={ticket}
              onUpdated={updated => setTicket(updated)}
            />
          )}

          {!isTech && (
            <div className="detail-card">
              <div className="detail-card-body" style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
                <p style={{ fontSize: 13, color: 'var(--text-lite)' }}>
                  Status updates are available to Technicians and Admins only.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default TicketDetail;

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { TicketStatusBadge, PriorityBadge } from '../components/tickets/TicketStatusBadge';
import CommentList    from '../components/comments/CommentList';
import TechnicianPanel from '../components/technician/TechnicianPanel';
import ticketService  from '../services/TicketService';
import commentService from '../services/commentService';
import { useAuth }    from '../context/AuthContext';
import { WORKFLOW_STEPS, CATEGORY_ICONS, BACKEND_URL } from '../utils/constants';
import './TicketDetailsPage.css';

/* ─────────────────────────────────────────
   WorkflowIndicator — 4-step progress bar
───────────────────────────────────────── */
function WorkflowIndicator({ status }) {
  const idx = WORKFLOW_STEPS.indexOf(status);
  return (
    <div className="workflow-steps">
      {WORKFLOW_STEPS.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        const cls    = done ? 'done' : active ? 'active' : '';
        return (
          <React.Fragment key={step}>
            <div className={`workflow-step ${cls}`}>
              <div className={`workflow-dot ${cls}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className="workflow-label">{step.replace('_', ' ')}</span>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <div className={`workflow-line ${done ? 'done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   TicketDetailsPage
   Props:
     ticket    – initial ticket object (passed from list)
     onBack()  – navigate back to list
───────────────────────────────────────── */
function TicketDetailsPage({ ticket: initialTicket, onBack }) {
  const { isStaff }  = useAuth();
  const [ticket,   setTicket]   = useState(initialTicket);
  const [comments, setComments] = useState(initialTicket.comments ?? []);
  const [loading,  setLoading]  = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : '—';

  /* ── Fetch fresh data ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tRes, cRes] = await Promise.all([
          ticketService.getTicketById(ticket.id),
          commentService.getCommentsByTicket(ticket.id),
        ]);
        setTicket(tRes.data);
        setComments(cRes.data);
      } catch {
        /* keep seed data */
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket? This will also remove related comments and attachments.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await ticketService.deleteTicket(ticket.id);
      onBack(true);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete ticket.';
      window.alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="ticket-details-page">
      {/* Back button */}
      <button id="back-to-tickets-btn" className="back-btn" onClick={onBack}>
        ← Back to Tickets
      </button>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-lite)', fontWeight: 600 }}>
              #{String(ticket.id).padStart(4, '0')}
            </div>
            <h2 className="ticket-detail-title">{ticket.title}</h2>
            <div className="ticket-detail-meta">
              <TicketStatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span style={{ fontSize: 12, color: 'var(--text-lite)' }}>
                🕒 {fmtDate(ticket.createdAt)}
              </span>
            </div>
          </div>

          {isStaff && (
            <button
              type="button"
              className="btn"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                borderColor: '#dc2626',
                color: '#dc2626',
                background: '#fff5f5',
                minWidth: 120,
              }}
            >
              {deleting ? 'Deleting...' : 'Delete Ticket'}
            </button>
          )}
        </div>
      </div>

      {/* Workflow progress */}
      {ticket.status !== 'REJECTED' && (
        <WorkflowIndicator status={ticket.status} />
      )}

      {/* Two-column layout */}
      <div className="detail-layout">

        {/* ── Left: info + attachments + comments ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Ticket info card */}
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
                  <p>
                    {CATEGORY_ICONS[ticket.category]} {ticket.category?.replace('_', ' ')}
                  </p>
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
                  <p>🕒 {fmtDate(ticket.updatedAt ?? ticket.createdAt)}</p>
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
                <span className="detail-card-title">
                  📎 Attachments ({ticket.attachmentUrls.length})
                </span>
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
              <span className="detail-card-title">
                💬 Comments ({comments.length})
              </span>
            </div>
            <div className="detail-card-body">
              {loading ? (
                <div className="spinner" />
              ) : (
                <CommentList
                  ticketId={ticket.id}
                  comments={comments}
                  onCommentAdded={(c) => setComments((prev) => [...prev, c])}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="panel-section">

          {/* Quick details */}
          <div className="detail-card">
            <div className="detail-card-header">
              <span className="detail-card-title">🔖 Details</span>
            </div>
            <div
              className="detail-card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div className="info-block">
                <label>Status</label>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className="info-block">
                <label>Priority</label>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="info-block">
                <label>Created</label>
                <p style={{ fontSize: 13 }}>{fmtDate(ticket.createdAt)}</p>
              </div>
              <div className="info-block">
                <label>Category</label>
                <p style={{ fontSize: 13 }}>{ticket.category?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Technician Panel (role-gated) */}
          {isStaff ? (
            <TechnicianPanel
              ticket={ticket}
              onUpdated={(updated) => setTicket(updated)}
            />
          ) : (
            <div className="detail-card">
              <div
                className="detail-card-body"
                style={{ textAlign: 'center', padding: 24 }}
              >
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
    </Layout>
  );
}

export default TicketDetailsPage;

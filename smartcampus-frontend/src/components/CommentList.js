import React, { useState } from 'react';
import TicketService from '../services/TicketService';
import { useAuth } from '../context/AuthContext';

/* ════════════════════════════════════
   CommentList + CommentItem + CommentForm
   props: ticketId, comments, onCommentAdded
════════════════════════════════════ */

function CommentItem({ comment }) {
  const colors = ['#4a9fd4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const colorIdx = (comment.authorName ?? 'A').charCodeAt(0) % colors.length;
  const initials = (comment.authorName ?? '?').slice(0, 2).toUpperCase();

  const time = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : '—';

  return (
    <div className="comment-item">
      <div className="avatar" style={{ background: colors[colorIdx] }}>{initials}</div>
      <div className="comment-bubble">
        <span className="comment-author">{comment.authorName}</span>
        <span className="comment-time">{time}</span>
        {comment.authorRole && (
          <span style={{
            marginLeft: 8, fontSize: 10, fontWeight: 600,
            background: '#e8f4fd', color: '#3080b8',
            padding: '1px 6px', borderRadius: 10,
          }}>
            {comment.authorRole}
          </span>
        )}
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
}

/* ── Form to add a new comment ── */
function CommentForm({ ticketId, onAdded }) {
  const { currentUser } = useAuth();
  const [content, setContent]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const payload = {
        ticketId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: content.trim(),
      };
      const res = await TicketService.addComment(payload);
      onAdded(res.data);
    } catch {
      // Offline fallback
      onAdded({
        id: Date.now(),
        ticketId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      });
    } finally {
      setContent('');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a comment or update…"
        rows={3}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting…' : '💬 Post Comment'}
        </button>
      </div>
    </form>
  );
}

/* ── Composed CommentList ── */
function CommentList({ ticketId, comments, onCommentAdded }) {
  return (
    <div>
      <div className="comment-list">
        {comments.length === 0 && (
          <p style={{ color: 'var(--text-lite)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            No comments yet. Be the first!
          </p>
        )}
        {comments.map(c => <CommentItem key={c.id} comment={c} />)}
      </div>
      <CommentForm ticketId={ticketId} onAdded={onCommentAdded} />
    </div>
  );
}

export default CommentList;

import React from 'react';

/**
 * CommentItem
 * Displays a single comment with a coloured avatar.
 * Props: comment – { id, authorName, authorRole, content, createdAt }
 */
function CommentItem({ comment }) {
  const COLORS = ['#4a9fd4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const colorIdx = (comment.authorName ?? 'A').charCodeAt(0) % COLORS.length;
  const initials  = (comment.authorName ?? '?').slice(0, 2).toUpperCase();

  const time = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString('en-GB', {
        day: '2-digit', month: 'short',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

  return (
    <div className="comment-item">
      {/* Avatar */}
      <div
        className="avatar"
        style={{ background: COLORS[colorIdx] }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Bubble */}
      <div className="comment-bubble">
        <span className="comment-author">{comment.authorName}</span>
        <span className="comment-time">{time}</span>

        {comment.authorRole && (
          <span
            style={{
              marginLeft: 8, fontSize: 10, fontWeight: 600,
              background: '#e8f4fd', color: '#3080b8',
              padding: '1px 6px', borderRadius: 10,
            }}
          >
            {comment.authorRole}
          </span>
        )}

        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
}

export default CommentItem;

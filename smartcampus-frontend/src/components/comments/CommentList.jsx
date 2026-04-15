import React from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

/**
 * CommentList
 * Composes CommentItem list + CommentForm into one section.
 * Props:
 *   ticketId        – number
 *   comments        – Comment[]
 *   onCommentAdded  – (comment) => void
 */
function CommentList({ ticketId, comments, onCommentAdded }) {
  return (
    <div>
      {/* List */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <p
            style={{
              color: 'var(--text-lite)', fontSize: 13,
              textAlign: 'center', padding: '20px 0',
            }}
          >
            No comments yet. Be the first to add one!
          </p>
        ) : (
          comments.map((c) => <CommentItem key={c.id} comment={c} />)
        )}
      </div>

      {/* Add comment */}
      <CommentForm ticketId={ticketId} onAdded={onCommentAdded} />
    </div>
  );
}

export default CommentList;

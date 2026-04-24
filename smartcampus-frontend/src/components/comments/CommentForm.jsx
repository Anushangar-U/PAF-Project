import React, { useState } from 'react';
import commentService from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';

/**
 * CommentForm
 * Textarea + submit button for posting a new comment.
 * Props:
 *   ticketId  – number
 *   onAdded(comment) – callback with newly created comment
 */
function CommentForm({ ticketId, onAdded }) {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const payload = {
        ticketId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content:    content.trim(),
      };
      const res = await commentService.addComment(payload);
      onAdded(res.data);
    } catch {
      /* Offline fallback */
      onAdded({
        id:         Date.now(),
        ticketId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content:    content.trim(),
        createdAt:  new Date().toISOString(),
      });
    } finally {
      setContent('');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        id="comment-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment or update…"
        rows={3}
        aria-label="Comment text"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          id="post-comment-btn"
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

export default CommentForm;

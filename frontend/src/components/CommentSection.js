import { useState } from 'react';
import { commentService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import '../styles/CommentSection.css';

export const CommentSection = ({ requestId, comments: initialComments, onCommentAdded, socket, isAccepted, isCaretikerOwner }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');
    try {
      await commentService.addComment(requestId, { content: newComment });
      setNewComment('');
      // Fetch updated comments
      const response = await commentService.getComments(requestId);
      setComments(response.data.data);
      
      // Emit socket event
      if (socket) {
        socket.emit('comment_added', {
          requestId,
          message: `New comment on request`,
        });
      }
      
      onCommentAdded?.();
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding comment');
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Messages</h3>

      {user?.role === 'donor' && !isAccepted && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '15px', color: '#856404' }}>
          💬 Accept this request first to leave messages for the caretaker
        </div>
      )}

      {user?.role === 'donor' && isAccepted && (
        <form onSubmit={handleAddComment} className="comment-form">
          {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '12px' }}>{error}</div>}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Message the caretaker (e.g., I'm coming on Jan 25 at 3 PM)..."
            rows="3"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Send Message'}
          </button>
        </form>
      )}

      {isCaretikerOwner && (
        <form onSubmit={handleAddComment} className="comment-form">
          {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '12px' }}>{error}</div>}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Reply to donors (e.g., Thank you! I'll be waiting)..."
            rows="3"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Send Reply'}
          </button>
        </form>
      )}

      {isCaretikerOwner && comments.length > 0 && (
        <div style={{ padding: '10px', backgroundColor: '#d4edff', borderRadius: '4px', marginBottom: '15px', color: '#0066cc' }}>
          📨 You have {comments.length} message(s) from donors
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No messages yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.full_name || comment.name}</strong>
                <span className="role-badge">{comment.role}</span>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

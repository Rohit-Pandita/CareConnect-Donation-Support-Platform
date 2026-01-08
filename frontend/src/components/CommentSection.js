import { useState } from 'react';
import { commentService } from '../services/api.js';
import '../styles/CommentSection.css';

export const CommentSection = ({ requestId, comments: initialComments, onCommentAdded, socket }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
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
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>

      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
          required
        ></textarea>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.full_name}</strong>
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

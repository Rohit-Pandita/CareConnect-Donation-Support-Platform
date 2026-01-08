import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requestService, donationService } from '../services/api.js';
import { CommentSection } from '../components/CommentSection.js';
import { useAuth } from '../context/AuthContext.js';
import '../styles/RequestDetail.css';

export const RequestDetailPage = ({ socket }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await requestService.getRequestById(id);
      setRequest(response.data.data);

      if (user?.role === 'donor') {
        const hasAccepted = response.data.data.donations?.some(d => d.donor_id === user.id);
        setIsAccepted(hasAccepted);
      }
    } catch (err) {
      setError('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!user || user.role !== 'donor') {
      setError('Only donors can accept requests');
      return;
    }

    setAcceptLoading(true);
    try {
      await donationService.acceptRequest(id);
      setIsAccepted(true);

      if (socket) {
        socket.emit('request_accepted', {
          requestId: id,
          message: `Donor accepted request: ${request.title}`,
        });
      }

      fetchRequest();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
    } finally {
      setAcceptLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div className="container"><div className="alert alert-error">{error}</div></div>;
  }

  if (!request) {
    return <div className="container"><div className="alert alert-warning">Request not found</div></div>;
  }

  return (
    <div className="container">
      <div className="request-detail-page">
        <div className="request-header">
          {request.image_url && (
            <img src={request.image_url} alt={request.title} className="detail-image" />
          )}

          <div className="request-info-block">
            <h1>{request.title}</h1>

            <div className="meta-info">
              <span className={`badge badge-${request.status}`}>{request.status}</span>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Category</span>
                <span className="value">{request.category}</span>
              </div>
              <div className="detail-item">
                <span className="label">Posted by</span>
                <span className="value">{request.created_by_name || 'Unknown'}</span>
              </div>
            </div>

            <p className="description">{request.description}</p>

            {user?.role === 'donor' && (
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={handleAcceptRequest}
                  disabled={isAccepted || acceptLoading || request.status === 'closed'}
                  className="btn btn-success"
                  style={{ marginRight: '10px' }}
                >
                  {isAccepted ? '✅ Already Accepted' : acceptLoading ? 'Accepting...' : '👍 Accept Donation'}
                </button>
                {isAccepted && (
                  <p style={{ color: 'green', marginTop: '10px' }}>
                    ✅ You accepted this request. Message the caretaker below!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <CommentSection
          requestId={id}
          comments={request.comments || []}
          onCommentAdded={fetchRequest}
          socket={socket}
        />
      </div>
    </div>
  );
};

import '../styles/RequestCard.css';

export const RequestCard = ({ request, onViewDetails, userRole }) => {
  return (
    <div className="request-card card">
      {request.image_url && (
        <img src={request.image_url} alt={request.title} className="request-image" />
      )}

      <h3 className="request-title">{request.title}</h3>

      <div className="request-meta">
        <span className={`badge badge-${request.status}`}>{request.status}</span>
      </div>

      <p className="request-description">{request.description.substring(0, 100)}...</p>

      <div className="request-info">
        <div className="info-row">
          <span className="label">Category:</span>
          <span className="value">{request.category}</span>
        </div>
        {request.created_by_name && (
          <div className="info-row">
            <span className="label">Posted by:</span>
            <span className="value">{request.created_by_name}</span>
          </div>
        )}
      </div>

      <button onClick={onViewDetails} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
        View Details
      </button>
    </div>
  );
};

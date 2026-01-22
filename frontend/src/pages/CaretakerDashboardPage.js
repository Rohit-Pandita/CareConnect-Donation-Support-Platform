import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/api.js';
import { notificationService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import '../styles/Dashboard.css';

export const CaretakerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchRequests();
    fetchNotifications();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestService.getUserRequests();
      setRequests(response.data.data);

      // Calculate stats
      const stats = {
        total: response.data.data.length,
        pending: response.data.data.filter(r => r.status === 'pending').length,
        accepted: response.data.data.filter(r => r.status === 'accepted').length,
        delivered: response.data.data.filter(r => r.status === 'delivered').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 10 });
      setNotifications(response.data.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    setDeleting(requestId);
    try {
      await requestService.deleteRequest(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
      alert('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting request');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-page">
        <h1>💼 Caretaker Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card card">
            <h3>Total Requests</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card card">
            <h3>Pending</h3>
            <p className="stat-number pending">{stats.pending}</p>
          </div>
          <div className="stat-card card">
            <h3>Accepted</h3>
            <p className="stat-number accepted">{stats.accepted}</p>
          </div>
          <div className="stat-card card">
            <h3>Delivered</h3>
            <p className="stat-number delivered">{stats.delivered}</p>
          </div>
        </div>

        {/* Notifications Section */}
        {notifications.length > 0 && (
          <div style={{ marginTop: '30px', marginBottom: '30px' }}>
            <h2>🔔 Notifications</h2>
            <div className="notifications-list card" style={{ padding: '15px' }}>
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: notif.is_read ? 'normal' : 'bold' }}>
                      {notif.message}
                    </p>
                    <small style={{ color: '#999' }}>
                      {new Date(notif.created_at).toLocaleString()}
                    </small>
                  </div>
                  {!notif.is_read && (
                    <span style={{ backgroundColor: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '3px', fontSize: '12px' }}>
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <h2>Your Requests</h2>
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : requests.length === 0 ? (
          <div className="alert alert-warning">No requests yet</div>
        ) : (
          <div className="requests-table card">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Urgency</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td><strong>{request.title}</strong></td>
                    <td>{request.category}</td>
                    <td><span className={`badge badge-${request.status}`}>{request.status}</span></td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        backgroundColor: request.urgency === 'high' ? '#ff6b6b' : request.urgency === 'medium' ? '#ffd93d' : '#6bcf7f',
                        color: 'white'
                      }}>
                        {request.urgency}
                      </span>
                    </td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/request/${request.id}`)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteRequest(request.id)}
                        disabled={deleting === request.id}
                        className="btn"
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px',
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {deleting === request.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

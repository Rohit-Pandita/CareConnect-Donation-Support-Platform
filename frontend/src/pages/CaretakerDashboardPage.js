import { useState, useEffect } from 'react';
import { requestService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import '../styles/Dashboard.css';

export const CaretakerDashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchRequests();
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

  return (
    <div className="container">
      <div className="dashboard-page">
        <h1>Caretaker Dashboard</h1>

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
                  <th>Quantity</th>
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
                    <td>{request.quantity}</td>
                    <td><span className={`badge badge-${request.status}`}>{request.status}</span></td>
                    <td>{request.urgency}</td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>
                      <a href={`/request/${request.id}`} className="btn btn-primary">View</a>
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

import { useState, useEffect } from 'react';
import { adminService } from '../services/api.js';
import '../styles/AdminDashboard.css';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await adminService.getAllRequests();
      setRequests(response.data.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminService.blockUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminService.unblockUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await adminService.deleteRequest(requestId);
        fetchRequests();
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
          </button>
        </div>

        {activeTab === 'overview' && stats && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers || 0}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Requests</h3>
                <p className="stat-number">{stats.totalRequests || 0}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Donations</h3>
                <p className="stat-number">{stats.totalDonations || 0}</p>
              </div>
            </div>

            <div className="stats-detail">
              <div className="card">
                <h3>Users by Role</h3>
                <ul>
                  {stats.usersByRole && stats.usersByRole.length > 0 ? (
                    stats.usersByRole.map((item) => (
                      <li key={item.role}>{item.role}: {item.count}</li>
                    ))
                  ) : (
                    <li>No user data available</li>
                  )}
                </ul>
              </div>

              <div className="card">
                <h3>Requests by Status</h3>
                <ul>
                  {stats.requestsByStatus && stats.requestsByStatus.length > 0 ? (
                    stats.requestsByStatus.map((item) => (
                      <li key={item.status}>{item.status}: {item.count}</li>
                    ))
                  ) : (
                    <li>No request data available</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="card">
              <h3>Recent Users</h3>
              <div className="activity-list">
                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <div key={user.id} className="activity-item">
                      <strong>{user.fullName}</strong> ({user.role})
                      <br />
                      <small>{user.email} - Joined: {new Date(user.createdAt).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p>No recent users</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <table className="card">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.phone}</td>
                    <td>{user.is_active ? 'Active' : 'Blocked'}</td>
                    <td>
                      {user.is_active ? (
                        <button
                          onClick={() => handleBlockUser(user.id)}
                          className="btn btn-danger"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user.id)}
                          className="btn btn-secondary"
                        >
                          Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-tab">
            <table className="card">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.title}</td>
                    <td>{request.category}</td>
                    <td><span className={`badge badge-${request.status}`}>{request.status}</span></td>
                    <td>{request.created_by_name}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="btn btn-danger"
                      >
                        Delete
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

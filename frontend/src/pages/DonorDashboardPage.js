import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService, donationService } from '../services/api.js';
import '../styles/Dashboard.css';

export const DonorDashboardPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('available'); // available or donations
  const [availableRequests, setAvailableRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    available: 0,
    totalDonations: 0,
    delivered: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching available requests...');
      const requestsRes = await requestService.getAllRequests({ 
        status: 'open',
        limit: 10,
        offset: 0
      });
      console.log('Requests response:', requestsRes.data);

      const donationsRes = await donationService.getDonations();
      console.log('Donations response:', donationsRes.data);

      const requests = requestsRes.data.data?.requests || [];
      const donations = donationsRes.data.data || [];

      console.log('Setting requests:', requests);
      console.log('Setting donations:', donations);

      setAvailableRequests(requests);
      setDonations(donations);

      setStats({
        available: requests.length,
        totalDonations: donations.length,
        delivered: donations.filter(d => d.status === 'delivered').length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (requestId) => {
    navigate(`/request/${requestId}`);
  };

  const handleViewDonation = (requestId) => {
    navigate(`/request/${requestId}`);
  };

  return (
    <div className="container">
      <div className="dashboard-page">
        <h1>💝 Donor Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card card">
            <h3>Available Requests</h3>
            <p className="stat-number">{stats.available}</p>
          </div>
          <div className="stat-card card">
            <h3>My Donations</h3>
            <p className="stat-number">{stats.totalDonations}</p>
          </div>
          <div className="stat-card card">
            <h3>Delivered</h3>
            <p className="stat-number delivered">{stats.delivered}</p>
          </div>
        </div>

        <div className="tabs" style={{ marginTop: '30px', marginBottom: '20px' }}>
          <button
            className={`tab-btn ${tab === 'available' ? 'active' : ''}`}
            onClick={() => setTab('available')}
          >
            🆕 Available Requests
          </button>
          <button
            className={`tab-btn ${tab === 'donations' ? 'active' : ''}`}
            onClick={() => setTab('donations')}
          >
            ✅ My Donations
          </button>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : tab === 'available' ? (
          availableRequests.length === 0 ? (
            <div className="alert alert-info">No requests available at the moment</div>
          ) : (
            <div className="requests-grid">
              {availableRequests.map((request) => (
                <div key={request.id} className="request-card card">
                  <h3>{request.title}</h3>
                  <p className="request-description">{request.description.substring(0, 100)}...</p>
                  <div className="request-info">
                    <span><strong>Category:</strong> {request.category}</span>
                    <span><strong>Posted by:</strong> {request.created_by_name}</span>
                  </div>
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    View & Accept
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          donations.length === 0 ? (
            <div className="alert alert-warning">No donations yet</div>
          ) : (
            <div className="donations-table card">
              <table>
                <thead>
                  <tr>
                    <th>Request Title</th>
                    <th>Status</th>
                    <th>Accepted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td><strong>{donation.title}</strong></td>
                      <td><span className={`badge badge-${donation.status}`}>{donation.status}</span></td>
                      <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleViewDonation(donation.request_id)}
                          className="btn btn-primary"
                        >
                          View & Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

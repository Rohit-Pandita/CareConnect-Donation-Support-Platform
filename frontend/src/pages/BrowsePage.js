import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { requestService } from '../services/api.js';
import { RequestCard } from '../components/RequestCard.js';
import '../styles/HomePage.css';

export const BrowsePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchRequests();
  }, [filters.status, filters.category, filters.page]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await requestService.getAllRequests(filters);
      setRequests(response.data.data.requests);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    fetchRequests();
  };

  const handleViewDetails = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  return (
    <div className="container">
      <div className="browse-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>🌍 Browse Donation Requests</h1>
        <p>Discover how you can make a difference</p>
        <Link to="/user-login" className="btn btn-primary" style={{ marginTop: '15px' }}>
          Login to Donate
        </Link>
      </div>

      <div className="home-page">
        <div className="filters card">
          <form onSubmit={handleSearch}>
            <div className="filter-row">
              <input
                type="text"
                name="search"
                placeholder="Search requests..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="delivered">Delivered</option>
              </select>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="Books">Books</option>
                <option value="Medicines">Medicines</option>
                <option value="Clothes">Clothes</option>
                <option value="Food">Food</option>
                <option value="Hygiene Products">Hygiene Products</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
              </select>
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : requests.length > 0 ? (
          <div className="requests-grid">
            {requests.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onViewDetails={() => handleViewDetails(request.id)}
                userRole={user?.role}
              />
            ))}
          </div>
        ) : (
          <div className="alert alert-info">No requests found</div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

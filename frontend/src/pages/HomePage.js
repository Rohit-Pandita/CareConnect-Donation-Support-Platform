import { useState, useEffect } from 'react';
import { requestService } from '../services/api.js';
import { RequestCard } from '../components/RequestCard.js';
import '../styles/HomePage.css';

export const HomePage = ({ socket }) => {
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

  useEffect(() => {
    if (!socket) return;

    socket.on('new_request', () => {
      fetchRequests();
    });

    return () => {
      socket.off('new_request');
    };
  }, [socket]);

  return (
    <div className="container">
      <div className="home-page">
        {/* Header Section */}
        <div className="home-header">
          <h1>🌍 Browse Donation Requests</h1>
          <p>Discover requests from institutions and help make a difference</p>
        </div>

        {/* Stats Section */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Requests</span>
            <span className="stat-value">{pagination.total || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Page</span>
            <span className="stat-value">{pagination.page || 1} of {pagination.pages || 1}</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters card">
          <h3 style={{ marginTop: '0', marginBottom: '1.5rem' }}>🔍 Filter Requests</h3>
          <form onSubmit={handleSearch}>
            <div className="filter-row">
              <input
                type="text"
                name="search"
                placeholder="🔎 Search requests..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">📋 All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Accepted</option>
                <option value="delivered">🎁 Delivered</option>
              </select>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">📂 All Categories</option>
                <option value="Books">📚 Books</option>
                <option value="Medicines">💊 Medicines</option>
                <option value="Clothes">👕 Clothes</option>
                <option value="Food">🍕 Food</option>
                <option value="Hygiene Products">🧼 Hygiene Products</option>
                <option value="Electronics">📱 Electronics</option>
                <option value="Furniture">🛋️ Furniture</option>
              </select>
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <p>📭 No requests found</p>
            <small>Try adjusting your filters</small>
          </div>
        ) : (
          <>
            <div className="requests-info">
              <p>Showing <strong>{requests.length}</strong> requests</p>
            </div>

            <div className="grid">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => window.location.href = `/request/${request.id}`}
                />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={filters.page === 1}
                  className="btn btn-outline"
                >
                  ⬅️ Previous
                </button>
                <span className="page-info">Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong></span>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                  disabled={filters.page === pagination.pages}
                  className="btn btn-outline"
                >
                  Next ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

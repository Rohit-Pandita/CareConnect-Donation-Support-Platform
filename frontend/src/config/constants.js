// CareConnect Configuration Constants

export const ITEM_CATEGORIES = [
  'Books',
  'Medicines',
  'Clothes',
  'Food',
  'Hygiene Products',
  'Electronics',
  'Furniture',
  'Other'
];

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  DONOR: 'donor',
  CARETAKER: 'caretaker',
  ADMIN: 'admin'
};

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  TIMEOUT: 10000
};

export const SOCKET_CONFIG = {
  URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  RECONNECTION_DELAY: 1000,
  RECONNECTION_ATTEMPTS: 5
};

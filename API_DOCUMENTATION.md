# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Authentication Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "caretaker" | "donor",
  "phone": "1234567890",
  "institutionName": "Optional for donors",
  "address": "123 Main St"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "accessToken": "...",
    "refreshToken": "...",
    "user": { ... }
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": { ... }
  }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "caretaker",
    ...
  }
}
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "phone": "9876543210",
  "address": "456 Oak St",
  "institutionName": "New Institution"
}

Response: 200
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

## Request Endpoints

### Create Request (Caretaker Only)
```
POST /requests
Authorization: Bearer <caretaker_token>
Content-Type: multipart/form-data

{
  "title": "Medical Supplies Needed",
  "description": "We need...",
  "category": "Medicines",
  "quantity": 5,
  "urgency": "high",
  "image": <file>
}

Response: 201
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "requestId": 1
  }
}
```

### Get All Requests
```
GET /requests?page=1&limit=10&status=pending&category=Books&search=supplies

Response: 200
{
  "success": true,
  "message": "Requests fetched",
  "data": {
    "requests": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

### Get Request Details
```
GET /requests/:id

Response: 200
{
  "success": true,
  "message": "Request fetched",
  "data": {
    "id": 1,
    "title": "...",
    "description": "...",
    "category": "Books",
    "quantity": 5,
    "status": "pending",
    "urgency": "high",
    "created_by_name": "Orphanage A",
    "donations": [...],
    "comments": [...]
  }
}
```

### Get User's Requests (Caretaker)
```
GET /requests/user/my-requests
Authorization: Bearer <caretaker_token>

Response: 200
{
  "success": true,
  "message": "User requests fetched",
  "data": [...]
}
```

### Update Request (Caretaker)
```
PUT /requests/:id
Authorization: Bearer <caretaker_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Books",
  "quantity": 10,
  "urgency": "medium"
}

Response: 200
{
  "success": true,
  "message": "Request updated",
  "data": { ... }
}
```

### Update Request Status
```
PATCH /requests/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted" | "delivered" | "cancelled"
}

Response: 200
{
  "success": true,
  "message": "Status updated"
}
```

### Delete Request
```
DELETE /requests/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Request deleted successfully"
}
```

---

## Comment Endpoints

### Add Comment
```
POST /requests/:requestId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "I can help with this!"
}

Response: 201
{
  "success": true,
  "message": "Comment added",
  "data": {
    "commentId": 5
  }
}
```

### Get Comments
```
GET /requests/:requestId/comments

Response: 200
{
  "success": true,
  "message": "Comments fetched",
  "data": [
    {
      "id": 1,
      "content": "Great request!",
      "full_name": "John Doe",
      "role": "donor",
      "created_at": "2024-01-07T10:00:00Z"
    }
  ]
}
```

### Delete Comment
```
DELETE /requests/:requestId/comments/:commentId
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Comment deleted"
}
```

---

## Donation Endpoints

### Accept Request (Donor)
```
POST /donations/requests/:requestId/accept
Authorization: Bearer <donor_token>

Response: 201
{
  "success": true,
  "message": "Request accepted",
  "data": {
    "donationId": 1
  }
}
```

### Get My Donations (Donor)
```
GET /donations/my-donations
Authorization: Bearer <donor_token>

Response: 200
{
  "success": true,
  "message": "Donations fetched",
  "data": [
    {
      "id": 1,
      "request_id": 5,
      "title": "Medical Supplies",
      "status": "accepted",
      "created_at": "2024-01-07T10:00:00Z"
    }
  ]
}
```

### Update Donation Status
```
PATCH /donations/:donationId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "delivered" | "cancelled"
}

Response: 200
{
  "success": true,
  "message": "Donation status updated"
}
```

### Get Caretaker Contact (After Accepting)
```
GET /donations/requests/:requestId/caretaker-contact
Authorization: Bearer <donor_token>

Response: 200
{
  "success": true,
  "message": "Contact info fetched",
  "data": {
    "id": 1,
    "full_name": "Orphanage Manager",
    "email": "manager@orphanage.com",
    "phone": "1234567890",
    "institution_name": "City Orphanage"
  }
}
```

---

## Notification Endpoints

### Get Notifications
```
GET /notifications?limit=20&offset=0
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Notifications fetched",
  "data": {
    "notifications": [...],
    "unreadCount": 3
  }
}
```

### Mark Notification as Read
```
PATCH /notifications/:notificationId/read
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark All as Read
```
PATCH /notifications/mark-all-read
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Admin Endpoints

### Dashboard Stats
```
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalUsers": 50,
    "usersByRole": [...],
    "totalRequests": 30,
    "requestsByStatus": [...],
    "totalDonations": 25,
    "recentActivity": [...]
  }
}
```

### Get All Users
```
GET /admin/users?page=1&limit=10
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "Users fetched",
  "data": {
    "users": [...],
    "pagination": { ... }
  }
}
```

### Block User
```
PATCH /admin/users/:userId/block
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "User blocked successfully"
}
```

### Unblock User
```
PATCH /admin/users/:userId/unblock
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "User unblocked successfully"
}
```

### Delete User
```
DELETE /admin/users/:userId
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## Socket.IO Events

### Client to Server
- `user_online` - Emit when user comes online
- `request_created` - New request posted
- `request_accepted` - Request accepted by donor
- `comment_added` - Comment added
- `status_updated` - Status changed
- `send_notification` - Send notification to user

### Server to Client
- `user_status` - User online/offline status
- `new_request` - New request available
- `request_accepted` - Request accepted event
- `comment_added` - Comment added event
- `status_updated` - Status updated event
- `notification` - Real-time notification

---

## Rate Limiting (Recommended)

- 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes
- File uploads: 10 per hour

## CORS

**Allowed Origins:** Configured in `CORS_ORIGIN` environment variable
**Methods:** GET, POST, PUT, DELETE, PATCH
**Headers:** Content-Type, Authorization

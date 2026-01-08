# CareConnect - Visual Architecture & Flow Diagram

## 🏗️ APPLICATION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     CARECONNECT APPLICATION                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   FRONTEND (React)                        │   │
│  │                   Port: 3000                              │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Pages (15)                                         │ │   │
│  │  │  ├─ Public (7)                                      │ │   │
│  │  │  │  ├─ Landing Page                                │ │   │
│  │  │  │  ├─ Browse Requests                             │ │   │
│  │  │  │  ├─ Donor Login                                 │ │   │
│  │  │  │  ├─ Donor Register                              │ │   │
│  │  │  │  ├─ Caretaker Login                             │ │   │
│  │  │  │  ├─ Caretaker Register                          │ │   │
│  │  │  │  └─ Admin Login                                 │ │   │
│  │  │  ├─ Donor (3)                                       │ │   │
│  │  │  │  ├─ Dashboard                                   │ │   │
│  │  │  │  ├─ Browse & Search                             │ │   │
│  │  │  │  └─ Request Details                             │ │   │
│  │  │  ├─ Caretaker (3)                                   │ │   │
│  │  │  │  ├─ Dashboard                                   │ │   │
│  │  │  │  ├─ Create Request                              │ │   │
│  │  │  │  └─ Request Details                             │ │   │
│  │  │  └─ Admin (1)                                       │ │   │
│  │  │     ├─ Overview Tab                                │ │   │
│  │  │     ├─ Users Tab                                   │ │   │
│  │  │     └─ Requests Tab                                │ │   │
│  │  │                                                     │ │   │
│  │  ├─ Components (5)                                      │ │   │
│  │  │  ├─ Navbar                                          │ │   │
│  │  │  ├─ PrivateRoute                                    │ │   │
│  │  │  ├─ RequestCard                                     │ │   │
│  │  │  ├─ NotificationPanel                               │ │   │
│  │  │  └─ CommentSection                                  │ │   │
│  │  │                                                     │ │   │
│  │  ├─ Services (1)                                        │ │   │
│  │  │  └─ api.js (24 endpoints)                           │ │   │
│  │  │                                                     │ │   │
│  │  ├─ Context (1)                                         │ │   │
│  │  │  └─ AuthContext                                     │ │   │
│  │  │                                                     │ │   │
│  │  ├─ Styles (11+)                                        │ │   │
│  │  │  ├─ Auth.css                                        │ │   │
│  │  │  ├─ Dashboard.css                                   │ │   │
│  │  │  ├─ CreateRequest.css                               │ │   │
│  │  │  ├─ Browse.css                                      │ │   │
│  │  │  ├─ AdminDashboard.css                              │ │   │
│  │  │  ├─ RequestDetail.css                               │ │   │
│  │  │  ├─ Navbar.css                                      │ │   │
│  │  │  ├─ Global.css                                      │ │   │
│  │  │  ├─ Cards.css                                       │ │   │
│  │  │  ├─ Modal.css                                       │ │   │
│  │  │  └─ Responsive.css                                  │ │   │
│  │  └─ Mock Data (for testing)                            │ │   │
│  │                                                        │ │   │
│  │  ┌───────────────────────────────────────────────────┐ │ │   │
│  │  │ HTTP/REST Calls (Axios)                           │ │ │   │
│  │  │ JWT Token in Headers                              │ │ │   │
│  │  └───────────────────────────────────────────────────┘ │ │   │
│  └─────────────────────────────────────────────────────────┘ │   │
│                                                               │   │
│  ┌──────────────────────────────────────────────────────┐   │   │
│  │               BACKEND (Express.js)                    │   │   │
│  │               Port: 5000                              │   │   │
│  │                                                        │   │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │   │
│  │  │  Routes (24 Endpoints)                          │ │   │   │
│  │  │  ├─ /api/auth/*                                 │ │   │   │
│  │  │  ├─ /api/requests/*                             │ │   │   │
│  │  │  ├─ /api/donations/*                            │ │   │   │
│  │  │  ├─ /api/comments/*                             │ │   │   │
│  │  │  └─ /api/admin/*                                │ │   │   │
│  │  │                                                  │ │   │   │
│  │  ├─ Controllers (Business Logic)                    │ │   │   │
│  │  │  ├─ authController.js                           │ │   │   │
│  │  │  ├─ requestController.js                        │ │   │   │
│  │  │  ├─ donationController.js                       │ │   │   │
│  │  │  ├─ commentController.js                        │ │   │   │
│  │  │  └─ adminController.js                          │ │   │   │
│  │  │                                                  │ │   │   │
│  │  ├─ Models (Database Queries)                       │ │   │   │
│  │  │  ├─ User.js                                      │ │   │   │
│  │  │  ├─ Request.js                                   │ │   │   │
│  │  │  ├─ Donation.js                                  │ │   │   │
│  │  │  ├─ Comment.js                                   │ │   │   │
│  │  │  └─ Notification.js                              │ │   │   │
│  │  │                                                  │ │   │   │
│  │  ├─ Middleware (Auth, Validation, Error Handling)  │ │   │   │
│  │  │  ├─ auth.js                                      │ │   │   │
│  │  │  ├─ validation.js                                │ │   │   │
│  │  │  ├─ errorHandler.js                              │ │   │   │
│  │  │  └─ cors.js                                      │ │   │   │
│  │  │                                                  │ │   │   │
│  │  ├─ Config (Database, JWT, Constants)              │ │   │   │
│  │  │  ├─ database.js                                  │ │   │   │
│  │  │  ├─ jwt.js                                       │ │   │   │
│  │  │  └─ constants.js                                 │ │   │   │
│  │  │                                                  │ │   │   │
│  │  └─ server.js (Entry Point)                         │ │   │   │
│  │                                                        │ │   │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │   │
│  │  │ MySQL Connection Pool                           │ │   │   │
│  │  └─────────────────────────────────────────────────┘ │   │   │
│  └──────────────────────────────────────────────────────┘   │   │
│                                                               │   │
│  ┌──────────────────────────────────────────────────────┐   │   │
│  │               DATABASE (MySQL)                        │   │   │
│  │               Port: 3306                              │   │   │
│  │                                                        │   │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │   │
│  │  │  Tables (6)                                     │ │   │   │
│  │  │  ├─ users                                       │ │   │   │
│  │  │  │  (id, email, password, fullName, role, etc) │ │   │   │
│  │  │  │                                              │ │   │   │
│  │  │  ├─ requests                                    │ │   │   │
│  │  │  │  (id, title, description, category, etc)    │ │   │   │
│  │  │  │                                              │ │   │   │
│  │  │  ├─ donations                                   │ │   │   │
│  │  │  │  (id, requestId, donorId, status, etc)      │ │   │   │
│  │  │  │                                              │ │   │   │
│  │  │  ├─ comments                                    │ │   │   │
│  │  │  │  (id, requestId, userId, text, etc)         │ │   │   │
│  │  │  │                                              │ │   │   │
│  │  │  ├─ notifications                               │ │   │   │
│  │  │  │  (id, userId, type, title, message, etc)    │ │   │   │
│  │  │  │                                              │ │   │   │
│  │  │  └─ admin_logs                                  │ │   │   │
│  │  │     (id, adminId, action, timestamp, etc)       │ │   │   │
│  │  │                                                  │ │   │   │
│  │  └─ Foreign Key Relationships                      │ │   │   │
│  │     ├─ users → requests (1:M)                      │ │   │   │
│  │     ├─ users → donations (1:M)                     │ │   │   │
│  │     ├─ users → comments (1:M)                      │ │   │   │
│  │     ├─ users → notifications (1:M)                 │ │   │   │
│  │     ├─ requests → donations (1:M)                  │ │   │   │
│  │     └─ requests → comments (1:M)                   │ │   │   │
│  └──────────────────────────────────────────────────────┘   │   │
│                                                               │   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 USER FLOW DIAGRAMS

### Donor Registration & Donation Flow
```
┌─────────────────────────────────────────────────────────┐
│ DONOR JOURNEY                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Landing Page                                          │
│       ↓                                                 │
│  Click "Become a Donor"                                 │
│       ↓                                                 │
│  DonorRegisterPage                                      │
│  (Fill: Name, Email, Phone, Address, Password)         │
│       ↓                                                 │
│  POST /api/auth/register                               │
│       ↓                                                 │
│  User created in database                              │
│       ↓                                                 │
│  Auto-login & store JWT token                          │
│       ↓                                                 │
│  DonorDashboardPage                                     │
│  (Show: Total Donations, Accepted, Delivered)          │
│       ↓                                                 │
│  Click "Browse Requests"                                │
│       ↓                                                 │
│  BrowsePage                                            │
│  (Show: All requests, filter, search, pagination)      │
│       ↓                                                 │
│  Click "View Request"                                   │
│       ↓                                                 │
│  RequestDetailPage                                      │
│  (Show: Full details, comments, accept button)         │
│       ↓                                                 │
│  Click "Accept Donation"                                │
│       ↓                                                 │
│  POST /api/donations/requests/:id/accept               │
│       ↓                                                 │
│  Donation record created                               │
│       ↓                                                 │
│  Return to Dashboard                                    │
│  (Show: +1 Donation in "Accepted" count)               │
│       ↓                                                 │
│  View donation status updates                          │
│       ↓                                                 │
│  When caretaker marks delivered:                       │
│  PATCH /api/donations/:id/status → "delivered"         │
│       ↓                                                 │
│  Donation moves to "Delivered" count                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Caretaker Request & Status Flow
```
┌──────────────────────────────────────────────────────────┐
│ CARETAKER JOURNEY                                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Landing Page                                           │
│       ↓                                                  │
│  Click "Help as Caretaker"                              │
│       ↓                                                  │
│  CaretakerRegisterPage                                  │
│  (Fill: Institution, Contact, Email, Phone, Address)    │
│       ↓                                                  │
│  POST /api/auth/register                                │
│       ↓                                                  │
│  User created in database (role: caretaker)             │
│       ↓                                                  │
│  Auto-login & store JWT token                           │
│       ↓                                                  │
│  CaretakerDashboardPage                                 │
│  (Show: Total, Pending, Accepted, Delivered)            │
│       ↓                                                  │
│  Click "Create New Request"                             │
│       ↓                                                  │
│  CreateRequestPage                                      │
│  (Fill: Title, Description, Category, Quantity, Image)  │
│       ↓                                                  │
│  POST /api/requests                                     │
│       ↓                                                  │
│  Request created (status: pending)                      │
│       ↓                                                  │
│  Request appears on BrowsePage for all donors           │
│       ↓                                                  │
│  Donors can accept & add comments                       │
│       ↓                                                  │
│  Caretaker views request details:                       │
│  ├─ See all donors who accepted                         │
│  ├─ Read comments & questions                           │
│  └─ Contact donor info                                  │
│       ↓                                                  │
│  When donation is received/delivered:                   │
│  Click "Mark as Delivered"                              │
│       ↓                                                  │
│  PATCH /api/donations/:id/status → "delivered"          │
│       ↓                                                  │
│  Request moves to "Delivered" count                      │
│       ↓                                                  │
│  Return to dashboard:                                   │
│  ├─ Updated stats                                       │
│  └─ Request removed from pending                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Admin Management Flow
```
┌─────────────────────────────────────────────────────────┐
│ ADMIN JOURNEY                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Landing Page                                          │
│       ↓                                                 │
│  Click "Admin Login"                                    │
│       ↓                                                 │
│  AdminLoginPage                                         │
│  (Email: admin@careconnect.com, Password: admin123)     │
│       ↓                                                 │
│  POST /api/auth/login                                   │
│       ↓                                                 │
│  Auto-login & store JWT token                          │
│       ↓                                                 │
│  AdminDashboardPage                                     │
│       ↓                                                 │
│  TAB 1: OVERVIEW                                        │
│  ├─ Total Users, Requests, Donations cards             │
│  ├─ Users by role breakdown                            │
│  ├─ Requests by status breakdown                       │
│  ├─ Growth charts                                      │
│  └─ Recent activity log                                │
│       ↓                                                 │
│  TAB 2: USERS MANAGEMENT                               │
│  ├─ List all users (name, email, role, status)         │
│  ├─ Search/filter users                                │
│  ├─ Block User → PUT /api/admin/users/:id/block        │
│  ├─ Unblock User → PUT /api/admin/users/:id/unblock    │
│  └─ Delete User (confirm dialog)                       │
│       ↓                                                 │
│  TAB 3: REQUESTS MONITORING                            │
│  ├─ List all requests (title, category, status)        │
│  ├─ Sort/filter by status                              │
│  ├─ View Request Details                               │
│  ├─ Delete Request → DELETE /api/admin/requests/:id    │
│  └─ Update Status (if needed)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│ JWT AUTHENTICATION FLOW                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. USER REGISTRATION                                        │
│     Frontend: POST /api/auth/register                        │
│     Payload: {email, password, fullName, role, ...}         │
│            ↓                                                  │
│     Backend: Hash password with bcryptjs                     │
│            ↓                                                  │
│     Database: INSERT user record                             │
│            ↓                                                  │
│     Generate JWT tokens (access + refresh)                   │
│            ↓                                                  │
│     Response: {accessToken, refreshToken, user}             │
│            ↓                                                  │
│     Frontend: Store tokens in localStorage                   │
│                                                              │
│  2. USER LOGIN                                               │
│     Frontend: POST /api/auth/login                           │
│     Payload: {email, password}                               │
│            ↓                                                  │
│     Backend: Find user by email                              │
│            ↓                                                  │
│     Compare password with bcryptjs                           │
│            ↓                                                  │
│     Generate JWT tokens                                      │
│            ↓                                                  │
│     Response: {accessToken, refreshToken, user}             │
│            ↓                                                  │
│     Frontend: Store tokens in localStorage                   │
│                                                              │
│  3. PROTECTED API CALLS                                      │
│     Frontend makes request:                                  │
│     GET /api/requests                                        │
│     Headers: {Authorization: Bearer {accessToken}}           │
│            ↓                                                  │
│     Backend middleware: Verify token signature               │
│            ↓                                                  │
│     Extract user ID from token claims                        │
│            ↓                                                  │
│     Execute business logic                                   │
│            ↓                                                  │
│     Response: Data (with 200 OK)                             │
│                                                              │
│  4. TOKEN EXPIRY & REFRESH                                   │
│     Access token expires after 1 hour                        │
│     API returns 401 Unauthorized                             │
│            ↓                                                  │
│     Frontend interceptor catches 401                         │
│            ↓                                                  │
│     POST /api/auth/refresh-token                             │
│     Payload: {refreshToken}                                  │
│            ↓                                                  │
│     Backend: Verify refresh token                            │
│            ↓                                                  │
│     Generate new access token                                │
│            ↓                                                  │
│     Response: {accessToken}                                  │
│            ↓                                                  │
│     Frontend: Update stored accessToken                      │
│            ↓                                                  │
│     Retry original request with new token                    │
│                                                              │
│  5. LOGOUT                                                   │
│     Frontend: Remove tokens from localStorage                │
│            ↓                                                  │
│     Backend: Optional - invalidate refresh token             │
│            ↓                                                  │
│     Redirect to login page                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Relationships

```
┌──────────────┐         ┌──────────────┐
│    USERS     │         │  REQUESTS    │
├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ id (PK)      │
│ email        │ 1:M     │ title        │
│ password     │         │ description  │
│ fullName     │         │ category     │
│ role         │         │ quantity     │
│ phone        │         │ status       │
│ address      │         │ user_id(FK)  │
│ institution  │         │ created_at   │
└──────────────┘         └──────────────┘
       ▲                         │
       │                         │
      │1:M                      │1:M
      │                         │
┌──────────────┐         ┌──────────────┐
│ DONATIONS    │         │  COMMENTS    │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ request_id   │◄───────│ request_id   │
│ (FK)         │ 1:M    │ (FK)         │
│ donor_id(FK) │         │ user_id(FK)  │
│ status       │         │ text         │
│ created_at   │         │ created_at   │
└──────────────┘         └──────────────┘
       ▲                        ▲
       │                        │
      │M:1                     │M:1
      │                        │
      └────┬────────────────────┘
           │
     ┌──────────────────────┐
     │ NOTIFICATIONS        │
     ├──────────────────────┤
     │ id (PK)              │
     │ user_id(FK)          │
     │ type                 │
     │ title                │
     │ message              │
     │ related_id           │
     │ created_at           │
     └──────────────────────┘

Relationships:
- 1 User → Many Requests (caretaker creates)
- 1 User → Many Donations (donor makes)
- 1 User → Many Comments
- 1 Request → Many Donations
- 1 Request → Many Comments
- 1 User → Many Notifications
```

---

## 🔄 API Call Flow Example

### Example: Accepting a Donation

```
DONOR SIDE (Frontend)
├─ Click "Accept Donation" button
├─ Call: donationService.acceptRequest(requestId)
│
└─> AXIOS REQUEST
    ├─ Method: POST
    ├─ URL: http://localhost:5000/api/donations/requests/123/accept
    ├─ Headers: {Authorization: "Bearer {accessToken}"}
    ├─ Body: {}
    │
    └─> SERVER SIDE (Backend)
        ├─ Express middleware checks JWT token
        ├─ Route handler: POST /donations/requests/:id/accept
        │
        └─> CONTROLLER (donationController.js)
            ├─ Extract requestId & donorId from token
            ├─ Validate request exists
            ├─ Validate request status is "pending"
            │
            └─> MODEL (Donation.js)
                ├─ INSERT donation record:
                │  ├─ request_id: 123
                │  ├─ donor_id: 456
                │  ├─ status: "accepted"
                │  └─ created_at: timestamp
                │
                └─> UPDATE request status:
                    ├─ UPDATE requests
                    ├─ SET status = "accepted"
                    ├─ WHERE id = 123
                    │
                    └─> Return response
                        ├─ Status: 200 OK
                        ├─ Body: {
                        │  ├─ data: {
                        │  │  ├─ donationId: 789
                        │  │  ├─ requestId: 123
                        │  │  ├─ status: "accepted"
                        │  │  └─ message: "Donation accepted!"
                        │  │}
                        │}
                        │
                        └─> AXIOS RESPONSE
                            ├─ Frontend receives success
                            ├─ Update component state
                            ├─ Show success message
                            ├─ Refresh donation list
                            ├─ Emit Socket.IO event (if enabled)
                            │  └─ socket.emit('donation_accepted')
                            └─ Return to Donor Dashboard
```

---

## 🔐 Role-Based Access Control

```
┌─────────────────────────────────────────┐
│         ROLE MATRIX                     │
├────────────┬─────────┬──────────┬──────┤
│ Feature    │ DONOR   │ CARETAKER│ADMIN │
├────────────┼─────────┼──────────┼──────┤
│ Register   │ ✅      │ ✅       │ ✅   │
│ Login      │ ✅      │ ✅       │ ✅   │
│ Profile    │ ✅      │ ✅       │ ✅   │
│            │         │          │      │
│ Browse     │ ✅      │ ✅       │ ✅   │
│ Create Req │ ❌      │ ✅       │ ✅   │
│ View Own   │ ✅      │ ✅       │ ✅   │
│ Edit Own   │ ❌      │ ✅       │ ✅   │
│ Delete Own │ ❌      │ ✅       │ ✅   │
│            │         │          │      │
│ Accept Don │ ✅      │ ❌       │ ✅   │
│ View Dons  │ ✅      │ ✅       │ ✅   │
│ Mark Deliv │ ✅      │ ✅       │ ✅   │
│            │         │          │      │
│ Add Comm   │ ✅      │ ✅       │ ✅   │
│ Delete Comm│ Own     │ Own      │ Any  │
│            │         │          │      │
│ Admin View │ ❌      │ ❌       │ ✅   │
│ Block User │ ❌      │ ❌       │ ✅   │
│ Delete Req │ ❌      │ ❌       │ ✅   │
│ View Stats │ ❌      │ ❌       │ ✅   │
└────────────┴─────────┴──────────┴──────┘
```

---

## 📱 Page Component Tree

```
App.js
├── /
│   └── LandingPage
│       ├── Button → /donor/login
│       ├── Button → /caretaker/login
│       └── Button → /admin/login
│
├── /browse
│   └── BrowsePage
│       ├── RequestCard (multiple)
│       ├── Filter controls
│       └── Pagination
│
├── /donor/login
│   └── DonorLoginPage
│
├── /donor/register
│   └── DonorRegisterPage
│
├── /donor/dashboard (Protected - Donor only)
│   └── DonorDashboardPage
│       └── RequestCard (multiple)
│
├── /requests/:id (Protected)
│   └── RequestDetailPage (Donor version)
│       ├── Comments
│       └── CommentSection
│
├── /caretaker/login
│   └── CaretakerLoginPage
│
├── /caretaker/register
│   └── CaretakerRegisterPage
│
├── /caretaker/dashboard (Protected - Caretaker only)
│   └── CaretakerDashboardPage
│       └── RequestCard (multiple)
│
├── /caretaker/create-request (Protected - Caretaker only)
│   └── CreateRequestPage
│
├── /requests/:id (Protected)
│   └── RequestDetailPage (Caretaker version)
│       ├── Comments
│       ├── CommentSection
│       └── Donations list
│
├── /admin/login
│   └── AdminLoginPage
│
└── /admin/dashboard (Protected - Admin only)
    └── AdminDashboardPage
        ├── Overview Tab
        ├── Users Tab
        └── Requests Tab

Layout (on all pages):
└── Navbar
    ├── Logo
    ├── Navigation links
    ├── User menu (dropdown)
    ├── Notifications (bell)
    │   └── NotificationPanel
    └── Logout button
```

---

## 🔄 Data Flow Example: Creating a Request

```
1. USER INTERACTION
   Caretaker fills form in CreateRequestPage:
   ├─ title: "School Supplies Needed"
   ├─ description: "Our orphanage needs books..."
   ├─ category: "Books"
   ├─ quantity: 50
   ├─ urgency: "high"
   └─ image: (file upload)

2. FORM SUBMISSION
   Call: requestService.createRequest(formData)
   ├─ Method: POST
   ├─ URL: /api/requests
   ├─ Content-Type: multipart/form-data
   ├─ Headers: {Authorization: Bearer {token}}
   └─ Body: FormData with all fields

3. BACKEND PROCESSING
   Route: POST /api/requests
   └─ Middleware:
      ├─ Verify JWT token ✓
      ├─ Check role is 'caretaker' ✓
      ├─ Validate form fields ✓
      └─ Check file size (if image) ✓
   
   └─ Controller: requestController.create()
      ├─ Extract userId from token (caretaker's ID)
      ├─ Prepare request object:
      │  ├─ title, description, category, quantity
      │  ├─ urgency, image_url
      │  ├─ status: 'pending' (default)
      │  ├─ user_id: {caretaker's ID}
      │  └─ created_at: NOW()
      │
      └─ Model: Request.create(requestData)
         ├─ INSERT INTO requests (...)
         └─ RETURN created request with ID

4. DATABASE CHANGES
   INSERT INTO requests (
     title, description, category, quantity,
     urgency, status, image_url, user_id, created_at
   ) VALUES (
     "School Supplies Needed", "Our orphanage...", "Books", 50,
     "high", "pending", "/uploads/image123.jpg", 123, NOW()
   );
   
   → New request ID: 456

5. RESPONSE TO FRONTEND
   Status: 201 Created
   Body: {
     data: {
       requestId: 456,
       title: "School Supplies Needed",
       status: "pending",
       createdAt: "2024-01-15T10:30:00Z",
       message: "Request created successfully!"
     }
   }

6. FRONTEND HANDLING
   ├─ Receive response
   ├─ Emit Socket.IO event (if enabled):
   │  └─ socket.emit('request_created', {...})
   ├─ Show success message
   ├─ Clear form
   ├─ Update local state
   └─ Redirect to /caretaker/dashboard

7. VISIBILITY TO OTHER USERS
   Donors can now see this request:
   ├─ On /browse page (all requests)
   ├─ Via search/filter
   ├─ Click to view details
   └─ Accept donation

8. DATABASE STATE
   ✓ New record in 'requests' table
   ✓ Status: pending (awaiting donations)
   ✓ User_id: 123 (caretaker who created)
   ✓ Ready to receive donations
```

---

This architecture diagram and flow charts show how all components work together to create a complete, functional donation platform!


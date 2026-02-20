# CareConnect - Donation & Support Platform

A full-stack marketplace connecting caretakers of orphanages and old-age homes with donors for direct item-based donations and support.

## 🎯 What is CareConnect?

CareConnect bridges the gap between institutions in need and compassionate donors. Caretakers post requests for items they need, donors browse and accept requests, and they communicate in real-time to coordinate donations.

## ✨ Key Features

**For Caretakers:**
- Create and manage item requests
- Track request status and donation progress
- Real-time messaging with interested donors
- Receive instant notifications

**For Donors:**
- Browse requests by category, location, and urgency
- Accept requests to donate items
- Real-time communication with caretakers
- Track donation status

## 🛠️ Tech Stack

**Frontend:** React.js, React Router, Context API, Socket.IO Client, CSS

**Backend:** Node.js, Express.js, Socket.IO, JWT Authentication, bcryptjs

**Database:** MySQL 

## 📦 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
mysql -u root -p < database.sql

# Create .env file with:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=careconnect_db
# JWT_SECRET=your_secret_key
# PORT=5000

npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file with:
# REACT_APP_API_URL=http://localhost:5000/api

npm start
```

Open `http://localhost:3000` in your browser.

## 🔄 How It Works

**Caretaker Flow:**
1. Register with institution details
2. Create requests for items needed
3. Browse donors who accepted
4. Chat to coordinate delivery
5. Mark request complete

**Donor Flow:**
1. Register as donor
2. Browse and filter requests
3. Accept requests to help
4. Message caretakers
5. Track donation status

## 🌟 Real-Time Features

- **Instant Notifications** - Real-time updates when donors accept requests
- **Live Messaging** - Socket.IO powered instant chat
- **Status Tracking** - See changes as they happen
- **Online Status** - Know when others are available


## 🔒 Security

- **JWT Authentication** - Secure token-based authentication
- **bcryptjs** - Password hashing with 10 salt rounds
- **Role-Based Access** - Different permissions for caretakers vs donors
- **Protected Routes** - Frontend and backend route protection
- **SQL Injection Prevention** - Parameterized database queries


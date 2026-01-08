# CareConnect - Quick Start Checklist ⚡

## Pre-Launch Checklist (Before Database Connection)

### ✅ Backend Setup
- [x] Backend folder created: `Care_Connect/backend/`
- [x] All 22+ files created (routes, controllers, models, middleware)
- [x] `backend/package.json` configured with all dependencies
- [x] `backend/.env.example` created (guide only)

**Action Required:**
- [ ] Create `backend/.env` with your MySQL credentials
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=careconnect_db
  JWT_SECRET=your_secret_key
  ```
- [ ] Run `npm install` in backend folder
  ```bash
  cd backend
  npm install
  ```

### ✅ Frontend Setup
- [x] React app initialized with Vite/CRA
- [x] All 15 page components created
- [x] All 5 reusable components created
- [x] API service layer configured
- [x] Authentication context set up
- [x] All routes defined

**Action Required:**
- [ ] Create `frontend/.env` 
  ```env
  REACT_APP_API_URL=http://localhost:5000/api
  REACT_APP_SOCKET_URL=http://localhost:5001
  REACT_APP_MOCK_API=false
  ```
- [ ] Run `npm install` in frontend folder
  ```bash
  cd frontend
  npm install
  ```

---

## Database Setup (Step-by-Step)

### Step 1: Install MySQL ✅
- [ ] Download MySQL Community Server from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- [ ] Install and set root password
- [ ] Test: `mysql -u root -p`

### Step 2: Create Database ✅
```bash
mysql -u root -p

# Run these commands:
CREATE DATABASE careconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE careconnect_db;
SHOW DATABASES;
```

### Step 3: Import Schema ✅
```bash
# Use your terminal path
mysql -u root -p careconnect_db < "C:\Projectss_Min\Care_Connect\backend\schema.sql"
```

**Verify Success:**
```bash
mysql -u root -p careconnect_db
SHOW TABLES;

# You should see 6 tables:
# - users
# - requests
# - donations
# - comments
# - notifications
# - admin_logs
```

### Step 4: Test Connection ✅
```bash
cd backend
npm test  # Or create test file (see DATABASE_CONNECTION_GUIDE.md)
```

---

## Launch Application

### Terminal 1: Start Backend
```bash
cd backend
npm start
```

**Expected Output:**
```
Server running on port 5000
Database connected successfully
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
http://localhost:3000 will open in your browser
```

---

## Test Workflows

### Test 1: Donor Registration & Login
1. Click "Become a Donor" on landing page
2. Fill form: Name, Email, Phone, Address, Password
3. Click Register
4. Should redirect to Donor Dashboard
5. Check database:
   ```bash
   mysql -u root -p careconnect_db
   SELECT * FROM users;
   ```

### Test 2: Caretaker Registration & Login
1. Click "Help as Caretaker" on landing page
2. Fill form: Institution Name, Contact Name, Email, Phone, Address, Password
3. Click Register
4. Should redirect to Caretaker Dashboard
5. Verify in database:
   ```bash
   SELECT * FROM users WHERE role='caretaker';
   ```

### Test 3: Create Donation Request (as Caretaker)
1. Login as caretaker
2. Click "Create New Request"
3. Fill: Title, Description, Category, Quantity, Urgency
4. Click Create
5. Should appear in Caretaker Dashboard
6. Check database:
   ```bash
   SELECT * FROM requests;
   ```

### Test 4: Browse & Accept Donation (as Donor)
1. Login as donor
2. Click "Browse Requests"
3. Find a request and click "Accept Donation"
4. Check database:
   ```bash
   SELECT * FROM donations;
   ```

### Test 5: Admin Dashboard
1. Go to landing page → Admin Login
2. Email: admin@careconnect.com, Password: admin123
3. View Stats, Users, and Requests tabs
4. Test block/unblock user
5. Test delete request

---

## Troubleshooting Quick Fixes

### Backend Won't Start
```bash
# Check if port 5000 is already in use
netstat -an | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Kill the process using port 5000
# Then restart backend
```

### Database Connection Error
```bash
# Verify MySQL is running
# Windows: Search "Services" → MySQL
# Mac: brew services list
# Linux: sudo systemctl status mysql

# Test connection manually
mysql -u root -p

# If fails, check:
# 1. Is MySQL installed?
# 2. Is password correct?
# 3. Is port 3306 open?
```

### Database Tables Not Found
```bash
# Re-import schema
mysql -u root -p careconnect_db < "C:\Projectss_Min\Care_Connect\backend\schema.sql"

# Verify
SHOW TABLES;
```

### CORS Error (Frontend Can't Reach Backend)
1. Check backend is running on port 5000
2. Check `frontend/.env` has: `REACT_APP_API_URL=http://localhost:5000/api`
3. Clear browser cache and refresh

### Login Not Working
1. Clear localStorage: DevTools → Application → Storage → localStorage → Clear
2. Refresh page and try again
3. Check browser console for errors (F12)

### API Calls Returning 404
1. Verify backend is running
2. Check all routes are implemented (see API_DOCUMENTATION.md)
3. Check endpoint URLs match

---

## File Locations Reference

```
Care_Connect/
├── backend/
│   ├── src/
│   │   ├── routes/     (API endpoints)
│   │   ├── controllers/ (Business logic)
│   │   ├── models/     (Data models)
│   │   ├── middleware/ (Auth, validation)
│   │   └── server.js   (Main entry point)
│   ├── schema.sql      (Database structure)
│   ├── package.json    (Dependencies)
│   └── .env            (Create this - your credentials)
│
├── frontend/
│   ├── src/
│   │   ├── pages/      (15 page components)
│   │   ├── components/ (5 reusable components)
│   │   ├── services/   (API layer)
│   │   ├── context/    (Auth state)
│   │   ├── styles/     (CSS files)
│   │   └── App.js      (Main app & routes)
│   ├── package.json    (Dependencies)
│   └── .env            (Create this - API URL)
│
├── STRUCTURE_VERIFICATION_CHECKLIST.md     (What's done ✅)
├── DATABASE_CONNECTION_GUIDE.md             (How to setup DB)
├── API_DOCUMENTATION.md                     (All endpoints)
└── README.md                                 (Project overview)
```

---

## Commands Quick Reference

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Start server
npm start

# Test database connection
npm test

# View logs
npm start  # Shows console output
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Database Commands
```bash
# Connect to MySQL
mysql -u root -p

# Select database
USE careconnect_db;

# View tables
SHOW TABLES;

# View table structure
DESCRIBE users;

# Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM requests;
SELECT COUNT(*) FROM donations;

# View all users
SELECT id, fullName, email, role FROM users;

# View all requests
SELECT id, title, category, status FROM requests;

# Clear all test data
TRUNCATE requests;
TRUNCATE donations;
TRUNCATE comments;
TRUNCATE notifications;

# Delete database (careful!)
DROP DATABASE careconnect_db;
```

---

## Important Configuration Files

### backend/.env
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=careconnect_db

JWT_SECRET=your_random_secret_key_here
JWT_REFRESH_SECRET=your_random_refresh_secret_here
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

### frontend/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5001
REACT_APP_MOCK_API=false
REACT_APP_ENV=development
```

---

## Default Admin Account

For testing admin features:
- **Email:** admin@careconnect.com
- **Password:** admin123
- **Role:** admin

This should be seeded in the database via `schema.sql`

---

## Page Routes Reference

### Public Routes
- `/` → Landing page
- `/browse` → Browse requests (public)
- `/donor/login` → Donor login
- `/donor/register` → Donor registration
- `/caretaker/login` → Caretaker login
- `/caretaker/register` → Caretaker registration
- `/admin/login` → Admin login

### Donor Routes (Protected)
- `/donor/dashboard` → Donor dashboard
- `/donor/browse` → Browse requests
- `/requests/:id` → View request details

### Caretaker Routes (Protected)
- `/caretaker/dashboard` → Caretaker dashboard
- `/caretaker/create-request` → Create new request
- `/requests/:id` → View request details

### Admin Routes (Protected)
- `/admin/dashboard` → Admin dashboard (with tabs)
- `/admin/users` → User management
- `/admin/requests` → Request monitoring

---

## What to Expect After Setup

### Donor User Flow
1. **Register** → Provide: Name, Email, Phone, Address, Password
2. **Login** → Access Donor Dashboard
3. **Browse Requests** → Search, filter, view requests
4. **Accept Donation** → Click accept on any request
5. **View Donations** → See all donations in dashboard
6. **Mark Delivered** → Update donation status

### Caretaker User Flow
1. **Register** → Provide: Institution Name, Contact Name, Email, Phone, Address, Password
2. **Login** → Access Caretaker Dashboard
3. **Create Request** → Add title, description, category, quantity, image
4. **View Requests** → See all requests created by institution
5. **Manage Status** → Update request status as donations come in
6. **View Donations** → See who donated what
7. **Mark Delivered** → Confirm delivery

### Admin User Flow
1. **Login** → admin@careconnect.com / admin123
2. **View Dashboard** → See analytics and statistics
3. **Manage Users** → Block/unblock users, view details
4. **Monitor Requests** → View all requests, delete if needed
5. **View Statistics** → Track users, donations, requests over time

---

## Success Indicators ✅

You'll know everything is working when:

- [x] Backend starts without errors (`npm start` → "Server running on port 5000")
- [x] Frontend loads without errors (http://localhost:3000 opens cleanly)
- [x] Can register new donor account
- [x] Can register new caretaker account
- [x] Can create donation request (as caretaker)
- [x] Can browse requests (as donor)
- [x] Can accept donation (as donor)
- [x] Can see all data in database via MySQL
- [x] Admin dashboard loads and shows statistics
- [x] No CORS errors in browser console
- [x] No JWT token errors
- [x] Can logout and re-login

---

## Next Phase: Enhancements (Optional)

After basic functionality works:

1. **Add Image Upload**
   - Currently form accepts images but backend needs processing

2. **Implement Real-Time Notifications**
   - Socket.IO setup ready, needs event handling

3. **Add Email Notifications**
   - Send emails when: new request, donation accepted, delivered

4. **Implement Messaging/Chat**
   - Add direct messaging between donors and caretakers

5. **Add Reviews/Ratings**
   - Rate donors and caretakers

6. **Analytics Reports**
   - Generate impact reports for caretakers

7. **Payment Integration**
   - Connect Stripe/PayPal for monetary donations

---

## Emergency Contacts & Resources

**If Something Breaks:**

1. Check browser console: F12 → Console tab
2. Check backend logs: Terminal where `npm start` was run
3. Check database: `mysql -u root -p careconnect_db`
4. Verify all environment variables are set

**Resources:**
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com/)

---

**Status: READY TO LAUNCH** 🚀

All files are in place. Follow the checklist above to get your CareConnect app running!


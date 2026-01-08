# CareConnect - MySQL Database Connection Guide

## Overview
This guide walks you through connecting your CareConnect application to a MySQL database.

---

## STEP 1: Install MySQL Server

### Windows:
1. Download MySQL Community Server from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Run the installer and follow setup wizard
3. During setup:
   - Choose "Server Machine" configuration
   - Set port to **3306** (default)
   - Configure MySQL as Windows Service
   - Set root password (remember this!)
   - Create default user account
4. Test installation:
   ```bash
   mysql -u root -p
   ```

### Mac (using Homebrew):
```bash
brew install mysql@8.0
brew services start mysql@8.0
```

### Linux (Ubuntu):
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

---

## STEP 2: Create Database

### Option A: Using Command Line
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE careconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Use the database
USE careconnect_db;

# View it was created
SHOW DATABASES;
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect using root user
3. Click "Create new schema"
4. Name: `careconnect_db`
5. Default charset: `utf8mb4`
6. Apply

---

## STEP 3: Import Database Schema

### The SQL Schema File
Located at: `backend/schema.sql`

This file contains:
- 6 database tables
- All relationships (foreign keys)
- Indexes for performance
- Sample data structure

### Import the Schema

**Option A: Command Line**
```bash
mysql -u root -p careconnect_db < backend/schema.sql
```

**Option B: MySQL Workbench**
1. Server → Data Import
2. Select "Import from Self-Contained File"
3. Choose `backend/schema.sql`
4. Select target schema: `careconnect_db`
5. Start Import

**Option C: MySQL CLI**
```bash
mysql -u root -p
USE careconnect_db;
source backend/schema.sql;
```

### Verify Schema Creation
```bash
mysql -u root -p careconnect_db

SHOW TABLES;
# Should display:
# - users
# - requests
# - donations
# - comments
# - notifications
# - admin_logs

DESCRIBE users;
# Should show columns: id, email, password, fullName, role, phone, address, etc.
```

---

## STEP 4: Configure Backend Environment

### File: `backend/.env`

Create or update your `.env` file with:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_root_password_here
DB_NAME=careconnect_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_refresh_secret_change_this
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Socket.IO Configuration
SOCKET_PORT=5001
```

### Important Security Notes:
1. **Never commit `.env` to Git** - it contains sensitive data
2. **Change JWT secrets** - generate strong random strings:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Protect your database password** - use strong passwords
4. For production, use environment variable services

---

## STEP 5: Configure Frontend Environment

### File: `frontend/.env`

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5001

# Feature Flags
REACT_APP_MOCK_API=false
REACT_APP_DEBUG=false
REACT_APP_ENV=development
```

---

## STEP 6: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- express - web framework
- mysql2 - database driver
- jsonwebtoken - JWT auth
- bcryptjs - password hashing
- dotenv - environment variables
- cors - cross-origin requests
- multer - file uploads
- socket.io - real-time communication
- And more...

---

## STEP 7: Test Database Connection

### Create Test Script

File: `backend/test-db.js`

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('✅ Database connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users table accessible. Total users:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\nChecklist:');
    console.error('- Is MySQL running?');
    console.error('- Is the database created?');
    console.error('- Is the schema imported?');
    console.error('- Are credentials correct in .env?');
  }
}

testConnection();
```

### Run Test
```bash
cd backend
node test-db.js
```

---

## STEP 8: Start the Application

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
# Should output:
# Server running on port 5000
# Database connected successfully
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
# Should open http://localhost:3000 in browser
```

---

## STEP 9: Test Complete Flow

### 1. Register a Donor Account
1. Go to http://localhost:3000
2. Click "Become a Donor"
3. Fill in: Name, Email, Phone, Address, Password
4. Submit
5. Check database:
   ```bash
   mysql -u root -p careconnect_db
   SELECT * FROM users WHERE role='donor';
   ```

### 2. Register a Caretaker Account
1. Go to http://localhost:3000
2. Click "Help as Caretaker"
3. Fill in: Institution Name, Contact Name, Email, Phone, Address, Password
4. Submit
5. Check database:
   ```bash
   SELECT * FROM users WHERE role='caretaker';
   ```

### 3. Create a Request (as Caretaker)
1. Login as caretaker
2. Go to Dashboard → Create New Request
3. Fill in: Title, Description, Category, Quantity, Urgency
4. Add image (if form supports it)
5. Submit
6. Check database:
   ```bash
   SELECT * FROM requests;
   ```

### 4. Accept Donation (as Donor)
1. Login as donor
2. Go to Browse Requests
3. Click on a request
4. Click "Accept Donation"
5. Check database:
   ```bash
   SELECT * FROM donations;
   ```

---

## DATABASE SCHEMA DETAILS

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  role ENUM('donor', 'caretaker', 'admin') NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  institutionName VARCHAR(255), -- For caretakers only
  profilePicture VARCHAR(255),
  isBlocked BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Requests Table
```sql
CREATE TABLE requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('pending', 'accepted', 'delivered') DEFAULT 'pending',
  image VARCHAR(255),
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Donations Table
```sql
CREATE TABLE donations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requestId INT NOT NULL,
  donorId INT NOT NULL,
  status ENUM('accepted', 'pending', 'delivered') DEFAULT 'pending',
  acceptedAt TIMESTAMP NULL,
  deliveredAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (donorId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requestId INT NOT NULL,
  userId INT NOT NULL,
  text TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  type VARCHAR(50), -- 'request_created', 'donation_accepted', etc.
  title VARCHAR(255),
  message TEXT,
  relatedId INT, -- ID of related request/donation
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## TROUBLESHOOTING

### Problem: "Can't connect to MySQL server"
**Solutions:**
1. Verify MySQL is running:
   ```bash
   # Windows
   services.msc (search for MySQL)
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```
2. Check credentials in `.env`
3. Test manually:
   ```bash
   mysql -u root -p
   ```

### Problem: "Database doesn't exist"
**Solution:**
```bash
mysql -u root -p
CREATE DATABASE careconnect_db;
USE careconnect_db;
source backend/schema.sql;
```

### Problem: "Table doesn't exist"
**Solution:**
Re-import schema:
```bash
# Clear database
DROP DATABASE careconnect_db;
CREATE DATABASE careconnect_db;

# Re-import
mysql -u root -p careconnect_db < backend/schema.sql
```

### Problem: "JWT token errors"
**Solution:**
1. Clear localStorage in browser (DevTools → Application → Storage)
2. Restart frontend and backend
3. Re-login

### Problem: "CORS errors"
**Solution:**
Verify in `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

### Problem: "File upload fails"
**Solution:**
1. Create `/uploads` directory in backend:
   ```bash
   cd backend
   mkdir uploads
   ```
2. Check file size limits in `.env`
3. Verify multer configuration

---

## MONITORING & DEBUGGING

### View Backend Logs
```bash
# Check for errors in server startup
npm start
```

### View Database Queries
```bash
# In MySQL
SET GLOBAL general_log = 'ON';
SHOW VARIABLES LIKE 'general_log%';

# Check logs
TAIL /var/log/mysql/error.log  # Linux/Mac
```

### Browser DevTools
1. F12 → Network tab
2. See all API requests and responses
3. Check status codes (200, 401, 500, etc.)
4. Inspect request/response payloads

### Redux DevTools (if using Redux)
1. Install Redux DevTools extension
2. Track state changes
3. Time-travel debugging

---

## NEXT STEPS

After successful database connection:

1. **Test all features:**
   - User registration and login
   - Request creation and viewing
   - Donation acceptance
   - Comment functionality
   - Admin features

2. **Add more data:**
   - Create sample requests
   - Make test donations
   - Add comments

3. **Implement real-time features:**
   - Socket.IO notifications
   - Live request updates
   - Chat functionality

4. **Deploy to production:**
   - Set up production database
   - Configure environment variables
   - Deploy backend (Heroku, AWS, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)

---

## USEFUL MySQL Commands

```bash
# Connect to database
mysql -u root -p

# Show all databases
SHOW DATABASES;

# Use specific database
USE careconnect_db;

# Show all tables
SHOW TABLES;

# Show table structure
DESCRIBE users;

# Count records
SELECT COUNT(*) FROM users;

# View recent records
SELECT * FROM users ORDER BY id DESC LIMIT 10;

# Clear all data (but keep tables)
TRUNCATE requests;
TRUNCATE donations;
TRUNCATE comments;

# Delete entire database
DROP DATABASE careconnect_db;

# Create backup
mysqldump -u root -p careconnect_db > backup.sql

# Restore from backup
mysql -u root -p careconnect_db < backup.sql
```

---

## SECURITY CHECKLIST

- [ ] Change MySQL root password
- [ ] Create dedicated database user (don't use root in production)
- [ ] Change JWT secrets in `.env`
- [ ] Enable HTTPS in production
- [ ] Add input validation on backend
- [ ] Implement rate limiting on API
- [ ] Add password hashing (bcryptjs already included)
- [ ] Enable CORS only for your frontend domain
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Keep MySQL updated

---

## PRODUCTION DEPLOYMENT

When deploying to production:

1. **Update `.env` for production:**
   ```env
   NODE_ENV=production
   DB_HOST=your_production_db_host
   DB_USER=production_db_user
   DB_PASSWORD=strong_password
   JWT_SECRET=very_long_random_string
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Ensure database backups:**
   - Automated daily backups
   - Test restore procedure
   - Keep backups off-site

3. **Monitor performance:**
   - Database query performance
   - API response times
   - Server resource usage

4. **SSL/TLS certificates:**
   - Enable HTTPS
   - Use Let's Encrypt (free)

5. **Load testing:**
   - Test with expected traffic
   - Optimize slow queries
   - Scale if needed

---

## SUPPORT

For database issues, check:
1. [MySQL Documentation](https://dev.mysql.com/doc/)
2. [MySQL Workbench Guide](https://dev.mysql.com/doc/workbench/en/)
3. Backend server logs
4. Browser console errors


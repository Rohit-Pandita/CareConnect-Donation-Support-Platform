# 🚀 Complete MySQL Setup Guide

## ✅ What's Been Done:

1. **✓ backend/.env** - Created with database credentials
2. **✓ database/schema.sql** - Created with 6 tables & schema
3. **✓ setup-mysql.bat** - Created setup script
4. **⏳ MySQL Database** - Ready to import

## 📋 Step-by-Step Setup

### Step 1: Start MySQL Service (Admin Mode Required)

**Option A - Using Windows Service Manager:**
```
1. Press WIN + R
2. Type: services.msc
3. Find "MySQL92"
4. Right-click → Start
```

**Option B - Command Line (Admin):**
```
net start MySQL92
```

### Step 2: Run the Setup Script

```bash
cd c:\Projectss_Min\Care_Connect\backend
setup-mysql.bat
```

Or manually:

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS careconnect;"
mysql -u root careconnect < database\schema.sql
```

### Step 3: Verify Database Creation

```bash
mysql -u root -e "USE careconnect; SHOW TABLES;"
```

You should see:
- users
- requests
- donations
- comments
- notifications
- admin_logs

### Step 4: Backend Configuration

✅ Already done! Check `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=careconnect
JWT_SECRET=careconnect_jwt_secret_key_2024_production
JWT_REFRESH_SECRET=careconnect_refresh_token_secret_2024_production
PORT=5000
NODE_ENV=production
```

### Step 5: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 6: Launch Application

```bash
# Terminal 1 - Backend (from backend folder)
npm start

# Terminal 2 - Frontend (from frontend folder)
npm start
```

## 🔍 Troubleshooting

### "Access denied for user 'root'@'localhost'"
- MySQL service not running
- Wrong password in .env
- Solution: Start MySQL service as Administrator

### "Can't connect to MySQL server"
- MySQL not installed or running
- Solution: Start MySQL92 service

### "Unknown database 'careconnect'"
- Schema not imported
- Solution: Run `setup-mysql.bat` as Administrator

## ✨ Default Admin Account

```
Email: admin@careconnect.com
Password: (Use during setup)
Role: admin
```

## 📊 Database Structure

| Table | Purpose |
|-------|---------|
| users | Store all user accounts (donors, caretakers, admins) |
| requests | Donation requests created by caretakers |
| donations | Donations made by donors to requests |
| comments | Discussion/comments on requests |
| notifications | Real-time notifications for users |
| admin_logs | Audit trail of admin actions |

## 🎯 What's Next?

1. ✅ Create .env file
2. ✅ Create schema.sql
3. ⏳ **Run setup script to create database**
4. ⏳ Install dependencies
5. ⏳ Start backend server
6. ⏳ Start frontend server
7. ⏳ Test application

---

**Status:** 🟢 Ready for MySQL connection once service is running

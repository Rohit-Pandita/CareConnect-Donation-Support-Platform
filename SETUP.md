# Setup Instructions for CareConnect

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
mysql -u root -p < database.sql
mkdir uploads
npm run dev
# Backend running on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
# Frontend running on http://localhost:3000
```

## Detailed Setup

### Backend Configuration

**Edit `backend/.env`:**
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=careconnect_db
JWT_SECRET=change_this_in_production
JWT_REFRESH_SECRET=change_this_too
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Database Setup

### Option 1: Using MySQL Command Line
```bash
mysql -u root -p
CREATE DATABASE careconnect_db;
USE careconnect_db;
source /path/to/database.sql;
```

### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new database: `careconnect_db`
3. Open `backend/database.sql`
4. Execute the SQL script

## Verify Installation

### Check Backend
```bash
curl http://localhost:5000/health
# Should return: {"status":"Server is running"}
```

### Check Frontend
- Open http://localhost:3000 in browser
- Should load login page

## Create Admin Account

1. Register as Caretaker first
2. Access MySQL:
   ```bash
   mysql -u root -p careconnect_db
   ```
3. Update user role to admin:
   ```sql
   UPDATE users SET role='admin' WHERE email='your_email@example.com';
   ```

## Troubleshooting

### MySQL Connection Error
```bash
# Check if MySQL is running
mysql -u root -p -e "SELECT 1"

# If not running on Windows:
# Services > MySQL > Right-click > Start

# Or start from command line:
mysqld
```

### Port 5000 Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Frontend Can't Connect to Backend
- Check CORS_ORIGIN in `backend/.env` matches frontend URL
- Ensure backend is running
- Check browser console for specific error

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Running in Production

### Backend
```bash
NODE_ENV=production npm start
```

### Frontend
```bash
npm run build
# Deploy the 'build' folder to hosting service
```

## File Uploads

The application supports image uploads for requests. Make sure:
1. `uploads/` folder exists in backend root
2. Max file size is 5MB (configurable in multer)
3. Only JPEG, PNG, GIF allowed

## Socket.IO Real-Time Features

Works automatically when both servers are running:
- New request notifications
- Comment notifications
- Status updates
- User online/offline status

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` in respective folder |
| Database error | Check MySQL is running & credentials in .env |
| CORS error | Verify CORS_ORIGIN in .env matches frontend URL |
| Port in use | Kill process with `lsof -i :PORT \| xargs kill -9` |
| Socket disconnects | Ensure both servers are running on correct ports |

## Next Steps

1. **Create test accounts** via registration page
2. **Test as Caretaker** - Create some requests
3. **Test as Donor** - Browse and accept requests
4. **Test as Admin** - Access admin dashboard
5. **Test real-time** - Open multiple browser windows
6. **Review code** - Understand the architecture
7. **Customize** - Modify for your needs
8. **Deploy** - Follow deployment guide in README.md

## Support

Refer to main README.md for comprehensive documentation.

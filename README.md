# CareConnect - Donation & Support Platform

A production-ready full-stack web application connecting caretakers of institutions with donors for item donations.

## Features

### Authentication & Security
- ✅ JWT-based authentication with access + refresh tokens
- ✅ Password hashing using bcrypt
- ✅ Role-based access control (Caretaker, Donor, Admin)
- ✅ Protected routes on frontend and backend
- ✅ Input validation using Joi

### Caretaker Features
- ✅ Create and manage item requests
- ✅ Track request status (Pending → Accepted → Delivered)
- ✅ Communicate with donors via comments
- ✅ Receive real-time notifications
- ✅ View donation status

### Donor Features
- ✅ Browse all active requests
- ✅ Filter by category, urgency, status
- ✅ Accept requests to donate
- ✅ Coordinate with caretakers
- ✅ View caretaker contact after accepting
- ✅ Mark donations as delivered
- ✅ Real-time notifications

### Admin Features
- ✅ Dashboard with analytics
- ✅ User management (block/unblock/delete)
- ✅ Request moderation
- ✅ View system statistics
- ✅ Monitor activity logs

### Real-Time Features
- ✅ Socket.IO integration
- ✅ Real-time notifications
- ✅ Live request updates
- ✅ Instant comment notifications

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **CSS3** - Responsive styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.IO** - Real-time features
- **Multer** - File uploads
- **Joi** - Input validation
- **Morgan** - HTTP logging

## Project Structure

```
Care_Connect/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database queries
│   │   ├── middleware/      # Auth, error handling
│   │   ├── services/        # Business services
│   │   ├── config/          # Database, constants
│   │   ├── utils/           # Helpers, validators
│   │   └── server.js        # Main server file
│   ├── database.sql         # SQL schema
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── styles/         # CSS files
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── public/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create database**
   ```bash
   mysql -u root -p < database.sql
   ```
   Enter your MySQL password when prompted.

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=careconnect_db
   
   JWT_SECRET=your_super_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Or create with this content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   App will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Requests
- `GET /api/requests` - Get all requests (with filters)
- `POST /api/requests` - Create request (caretaker only)
- `GET /api/requests/:id` - Get request details
- `GET /api/requests/user/my-requests` - Get user's requests
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `PATCH /api/requests/:id/status` - Update status

### Comments
- `POST /api/requests/:requestId/comments` - Add comment
- `GET /api/requests/:requestId/comments` - Get comments
- `DELETE /api/requests/:requestId/comments/:commentId` - Delete comment

### Donations
- `POST /api/donations/requests/:requestId/accept` - Accept request
- `GET /api/donations/my-donations` - Get donor's donations
- `PATCH /api/donations/:donationId/status` - Update donation status
- `GET /api/donations/requests/:requestId/caretaker-contact` - Get contact info

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:notificationId/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:userId/block` - Block user
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/requests` - Get all requests
- `DELETE /api/admin/requests/:requestId` - Delete request

## Database Schema

### Users Table
```sql
- id (INT, PK)
- full_name, email, password, phone
- role (caretaker/donor/admin)
- institution_name (for caretakers)
- address, bio
- is_verified, is_active
```

### Requests Table
```sql
- id (INT, PK)
- title, description, category
- quantity, urgency
- status (pending/accepted/delivered/cancelled)
- image_url, created_by (FK)
- created_at, updated_at
```

### Donations Table
```sql
- id (INT, PK)
- request_id (FK), donor_id (FK)
- status, delivery_date
```

### Comments Table
```sql
- id (INT, PK)
- request_id (FK), user_id (FK)
- content, created_at
```

### Notifications Table
```sql
- id (INT, PK)
- user_id (FK), type, message
- related_id, related_type
- is_read, created_at
```

## User Roles & Permissions

### Caretaker
- Create, read, update, delete own requests
- View request status and donations
- Comment on requests
- Receive notifications

### Donor
- Browse all requests
- Filter and search requests
- Accept requests
- View caretaker contact after accepting
- Comment on requests
- Mark donations as delivered

### Admin
- View all users and requests
- Block/unblock users
- Delete users and requests
- View analytics and statistics
- Monitor system activity

## Testing

### Test Login Credentials

**Admin Account:**
- Email: `admin@careconnect.com`
- Password: `Admin@123`

**Caretaker Account:**
- Email: `caretaker@careconnect.com`
- Password: `Care@123`

**Donor Account:**
- Email: `donor@careconnect.com`
- Password: `Donor@123`

You can create test accounts through the registration page.

## Deployment

### Production Checklist

1. **Update Environment Variables**
   ```bash
   JWT_SECRET=strong_random_secret
   JWT_REFRESH_SECRET=another_strong_secret
   NODE_ENV=production
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Setup Database**
   - Use managed database service (AWS RDS, Google Cloud SQL)
   - Run migrations in production environment

4. **Deploy Backend**
   - Option 1: Heroku
     ```bash
     heroku create careconnect-app
     git push heroku main
     ```
   - Option 2: AWS, Google Cloud, or any Node.js hosting

5. **Deploy Frontend**
   - Deploy `build/` folder to:
     - Vercel
     - Netlify
     - GitHub Pages
     - AWS S3 + CloudFront

6. **Setup CORS**
   - Update `CORS_ORIGIN` in backend .env

## Performance Optimizations

- ✅ Pagination for requests (10 items per page)
- ✅ Request caching with axios
- ✅ Lazy loading components
- ✅ Database indexes on frequently queried fields
- ✅ Efficient Socket.IO event handling

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token validation on all protected routes
- ✅ CORS configuration
- ✅ Input validation with Joi
- ✅ SQL injection prevention with parameterized queries
- ✅ XSS protection with React escaping
- ✅ Rate limiting (recommended for production)
- ✅ HTTPS in production

## Future Enhancements

- [ ] Email notifications
- [ ] Image processing & compression
- [ ] Advanced analytics dashboard
- [ ] Two-factor authentication
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Donation tracking reports
- [ ] API rate limiting
- [ ] Caching layer (Redis)
- [ ] Unit & integration tests
- [ ] GraphQL API option
- [ ] Microservices architecture

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify .env credentials
```

### CORS Error
- Ensure `CORS_ORIGIN` in backend .env matches frontend URL
- For local development: `http://localhost:3000`

### Socket.IO Connection Failed
- Ensure backend is running
- Check browser console for errors
- Verify Socket.IO port (same as backend port)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create new issue with detailed description
3. Contact: support@careconnect.com

## Acknowledgments

- Built for learning and production purposes
- Best practices from industry-standard projects
- Community-driven development

---

**Ready to contribute?** Fork, code, and submit your awesome contributions! 🚀

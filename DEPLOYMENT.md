# CareConnect Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Frontend build successful
- [ ] Backend runs without errors
- [ ] CORS configured correctly
- [ ] JWT secrets changed from defaults
- [ ] Sensitive data removed from code

## Deployment Options

### Option 1: Heroku (Easiest)

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Prepare backend**
   ```bash
   cd backend
   ```

3. **Create Heroku app**
   ```bash
   heroku login
   heroku create careconnect-backend
   ```

4. **Add MySQL (ClearDB or JawsDB)**
   ```bash
   heroku addons:create cleardb:ignite
   # Or: heroku addons:create jawsdb:kitefin
   ```

5. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_strong_secret
   heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```

6. **Deploy**
   ```bash
   git push heroku main
   # Or: git push heroku your-branch:main
   ```

#### Frontend Deployment

**Deploy to Vercel:**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your repository
   - Set project root to `frontend/`

3. **Configure environment variables**
   ```
   REACT_APP_API_URL=https://careconnect-backend.herokuapp.com/api
   REACT_APP_SOCKET_URL=https://careconnect-backend.herokuapp.com
   ```

4. **Deploy** - Vercel auto-deploys on push

**Or Deploy to Netlify:**

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Drag & drop `build` folder to Netlify**
   - Or: Connect GitHub for auto-deployment

3. **Configure redirect rules**
   - Create `netlify.toml`:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

### Option 2: AWS (More Control)

#### Backend on EC2

1. **Launch EC2 Instance**
   - Use Ubuntu 20.04 LTS AMI
   - Configure security group (ports 22, 80, 443, 5000)
   - Create & save key pair

2. **Connect & Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   sudo apt update
   sudo apt install -y nodejs npm mysql-server git
   ```

3. **Clone & Setup**
   ```bash
   git clone your-repo.git
   cd Care_Connect/backend
   npm install
   ```

4. **Setup MySQL**
   ```bash
   sudo mysql < database.sql
   ```

5. **Configure .env**
   ```bash
   nano .env
   # Set all variables
   ```

6. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name careconnect
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install -y nginx
   ```
   
   Configure `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

#### Frontend on S3 + CloudFront

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://careconnect-frontend
   ```

3. **Upload build**
   ```bash
   aws s3 sync build/ s3://careconnect-frontend/
   ```

4. **Create CloudFront distribution**
   - Origin: Your S3 bucket
   - Default root object: index.html
   - Set error handling to index.html

### Option 3: Docker (Recommended for Production)

**Create `Dockerfile` for backend:**
```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: careconnect_db
    volumes:
      - ./database.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_USER: root
      DB_PASSWORD: root_password
      DB_NAME: careconnect_db
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

## Post-Deployment

### Monitoring

1. **Setup error tracking** (Sentry)
   ```bash
   npm install --save @sentry/node
   ```

2. **Setup logging** (CloudWatch, LogRocket)

3. **Setup alerts** (PagerDuty, DataDog)

### Database Backups

```bash
# Automated daily backup
0 2 * * * mysqldump -u root -p'password' careconnect_db > backup.sql
```

### Performance Optimization

1. **Enable gzip compression**
2. **Optimize images**
3. **Setup CDN for static assets**
4. **Enable caching headers**
5. **Use database connection pooling**

### Security Hardening

1. **Update dependencies regularly**
   ```bash
   npm audit fix
   ```

2. **Enable HTTPS everywhere**

3. **Setup WAF (Web Application Firewall)**

4. **Rate limiting**
   ```javascript
   npm install express-rate-limit
   ```

5. **HELMET for security headers**
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

## Maintenance

### Regular Tasks

- [ ] Monitor error logs
- [ ] Review user feedback
- [ ] Update dependencies
- [ ] Check database performance
- [ ] Review security logs
- [ ] Backup database

### Scaling

When traffic increases:

1. **Horizontal scaling** - Add more instances behind load balancer
2. **Database scaling** - Add read replicas
3. **Caching** - Implement Redis
4. **CDN** - Use CDN for static content

## Rollback Plan

If deployment fails:

```bash
# Heroku
heroku rollback

# AWS
aws deploy stop-deployment

# Docker
docker-compose down
docker-compose up -d <previous-version>
```

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**
- Backend not running
- Check `pm2 logs`
- Verify port is correct

**CORS Error**
- Update `CORS_ORIGIN` environment variable
- Restart backend

**Database Connection Failed**
- Check security group rules
- Verify credentials
- Check database is running

**High Memory Usage**
- Check for memory leaks
- Enable garbage collection
- Use clustering

---

For more help, refer to official documentation of your chosen hosting platform.

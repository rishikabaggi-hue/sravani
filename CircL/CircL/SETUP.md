# CircL - Installation & Setup Guide

## Overview

CircL is a full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO.

## System Requirements

- **Node.js**: 16.x or higher
- **npm**: 7.x or higher
- **MongoDB**: 4.4 or higher
- **Git**: For version control

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CircL
```

### 2. Install Dependencies

#### Backend Setup

```bash
cd server
npm install
```

#### Frontend Setup

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

#### Server Configuration

Create `server/.env`:

```bash
cd server
cp ../.env.example .env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/circl
JWT_SECRET=your_secure_random_secret_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Change `JWT_SECRET` to a secure random string in production.

#### Client Configuration

Create `client/.env`:

```bash
cd ../client
cp .env.example .env
```

The default values should work:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start MongoDB

Ensure MongoDB is running:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or if installed locally
mongod
```

### 5. Start the Servers

#### Terminal 1 - Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
✓ MongoDB connected successfully
╔════════════════════════════════════╗
║  CircL Server Running              ║
║  Port: 5000                        ║
║  Environment: development          ║
╚════════════════════════════════════╝
```

#### Terminal 2 - Frontend Development Server

```bash
cd client
npm run dev
```

The application will open at `http://localhost:3000`

## Features Ready to Use

### ✅ Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Session persistence
- Profile management

### ✅ Real-Time Chat
- Public room messaging
- Private direct messages
- Message reactions (emojis)
- Message replies
- Typing indicators
- Online/offline status
- Message pinning

### ✅ Rooms
- Create and manage chat rooms
- Join/leave rooms
- Room rules and descriptions
- Temporary rooms with expiry
- Anonymous messaging option
- Member list and count

### ✅ Users & Permissions
- Role-based access (admin, moderator, member, observer)
- Block/unblock users
- Private chat consent system
- User reputation system
- Activity logging

### ✅ UI/UX Features
- Light/dark theme toggle
- Responsive design (mobile, tablet, desktop)
- Smooth animations
- Loading states
- Toast notifications
- Real-time updates

## Project Structure

```
CircL/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # State management
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & Socket services
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Database & JWT config
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── sockets/       # Socket.IO handlers
│   │   ├── jobs/          # Background jobs
│   │   ├── app.js         # Express app
│   │   └── server.js      # Entry point
│   ├── package.json
│   └── .env
│
├── .env                   # Environment variables
└── README.md             # Main documentation
```

## Testing the Application

### 1. Create a Test Account

- Go to `http://localhost:3000/register`
- Fill in the form with:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `password123`
- Click Register

### 2. Create a Room

- Click the "+" button in the Rooms section
- Fill in:
  - Room Name: "Test Room"
  - Description: "A test room for CircL"
  - Topic: "General"
- Click Create

### 3. Send a Message

- Select the room from the list
- Type a message in the input field
- Press Enter or click Send

### 4. Test Real-Time Features

- Open the app in multiple browser windows
- Log in with different accounts
- Watch messages appear in real-time
- Test typing indicators
- Try reactions and message actions

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Rooms
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room

### Messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/react` - Add reaction
- `GET /api/messages/private/:recipientId` - Private messages

### Users
- `GET /api/users` - List users
- `POST /api/users/:id/block` - Block user
- `DELETE /api/users/:id/unblock` - Unblock user

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
✗ MongoDB connection error
```
Solution: Ensure MongoDB is running on port 27017

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Change PORT in `.env` or kill process using port 5000

**JWT Secret Not Set**
```
Error: JWT secret is required
```
Solution: Set `JWT_SECRET` in `server/.env`

### Frontend Issues

**API Connection Error**
```
Error: Failed to connect to API
```
Solution: Ensure backend is running and `VITE_API_URL` is correct

**Module Not Found**
```
Cannot find module 'react'
```
Solution: Run `npm install` in client directory

### Socket.IO Issues

**Connection Timeout**
```
Socket connection failed
```
Solution: Check if backend is running and `VITE_SOCKET_URL` is correct

## Deployment

### Backend Deployment (Heroku Example)

```bash
cd server
heroku create circl-backend
heroku config:set MONGODB_URI=<your-mongodb-url>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
cd client
npm run build
vercel
```

## Development Tips

### Debugging Backend

Enable verbose logging:
```javascript
// In server/src/app.js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

### Debugging Frontend

Use React DevTools Chrome extension for state debugging.

### Live Reload

Both client and server have hot reload enabled:
- Backend: Nodemon watches for file changes
- Frontend: Vite provides HMR (Hot Module Replacement)

## Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Message pagination for large rooms
- Redis caching (optional)
- Connection pooling

### Frontend
- Code splitting with React.lazy
- Image optimization
- Bundle size monitoring
- Virtual scrolling for long message lists

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS in production
- [ ] Set appropriate CORS_ORIGIN
- [ ] Implement rate limiting
- [ ] Enable CSRF protection
- [ ] Use environment variables for secrets
- [ ] Validate all user inputs
- [ ] Implement proper authentication

## Support & Documentation

- Full API documentation: See `server/README.md`
- Frontend component guide: See `client/README.md`
- MongoDB schema documentation: See model files
- Socket.IO event documentation: See socket files

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Enjoy using CircL! 🎉**

For issues and feature requests, please open an issue on GitHub.

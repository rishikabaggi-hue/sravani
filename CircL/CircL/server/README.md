# CircL Server

A scalable Node.js backend for real-time chat application with MongoDB, Express, and Socket.IO.

## Features

- RESTful API for authentication, rooms, messages, and users
- Real-time communication with Socket.IO
- JWT-based authentication
- MongoDB database with Mongoose ORM
- Role-based access control
- Rate limiting and security middleware
- Background jobs for room expiry
- User reputation system
- Activity logging

## Prerequisites

- Node.js 16+
- MongoDB 4.4+
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```bash
cp ../.env .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/circl
JWT_SECRET=your_secure_secret_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Development

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## Production

```bash
npm start
```

## Project Structure

- `src/config/` - Configuration files
- `src/controllers/` - Request handlers
- `src/models/` - Database schemas
- `src/routes/` - API endpoints
- `src/middlewares/` - Custom middleware
- `src/services/` - Business logic
- `src/sockets/` - Socket.IO event handlers
- `src/jobs/` - Background jobs

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/react` - Add reaction
- `GET /api/messages/private/:recipientId` - Get private messages

### Users
- `GET /api/users` - Get users list
- `GET /api/users/:id` - Get user details
- `POST /api/users/:id/block` - Block user
- `DELETE /api/users/:id/unblock` - Unblock user
- `POST /api/users/:id/request-chat` - Request private chat

## Socket.IO Events

### Chat Events
- `send_message` - Send room message
- `send_private_message` - Send private message
- `typing` - User typing
- `stop_typing` - User stopped typing
- `react_message` - React to message
- `delete_message` - Delete message
- `pin_message` - Pin message

### Presence Events
- `user_login` - User logged in
- `user_logout` - User logged out
- `user_online` - User online status
- `user_offline` - User offline status
- `get_online_users` - Get online users list

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **socket.io** - Real-time communication
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin support
- **express-rate-limit** - Rate limiting
- **node-cron** - Scheduled tasks
- **joi** - Input validation

## Error Handling

The server returns consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `500` - Server error

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- CORS enabled for specified origins
- Rate limiting on sensitive endpoints
- Input validation with Joi
- SQL injection prevention through Mongoose

## Database

MongoDB collections:
- `users` - User accounts and profiles
- `rooms` - Chat rooms
- `messages` - Chat messages
- `activitylogs` - User activity tracking

## Deployment

The server can be deployed to:
- Heroku
- AWS (EC2, ECS, Lambda)
- Digital Ocean
- Railway
- Render

Environment variables must be set before deployment.

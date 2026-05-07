# 🚀 CircL - Quick Start Guide

Get CircL running in 5 minutes!

## Prerequisites

- **Node.js 16+**
- **MongoDB** (or Docker)

## Step 1: Install Dependencies (2 min)

```bash
# Backend
cd server
npm install

# Frontend (new terminal)
cd client
npm install
```

## Step 2: Configure Environment (1 min)

```bash
# The .env file is already created with defaults
# No changes needed for local development!
```

## Step 3: Start MongoDB (1 min)

```bash
# Option A: Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo

# Option B: If MongoDB is installed locally
mongod
```

## Step 4: Start the Servers (1 min)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
╔════════════════════════════════════╗
║  CircL Server Running              ║
║  Port: 5000                        ║
║  Environment: development          ║
╚════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The browser will open to: `http://localhost:3000`

## Test It Out! 🎯

### 1. Create First Account
- Click "Register"
- Fill in any test data:
  - Username: `alice`
  - Email: `alice@test.com`
  - Password: `password123`
- Click Register

### 2. Create a Room
- Click the "+" button (Create Room)
- Room Name: "Welcome to CircL"
- Click Create

### 3. Send a Message
- Select the room
- Type: "Hello CircL! 👋"
- Press Enter

### 4. Test Real-Time (Optional)
- Open browser dev tools: F12
- Open console
- Open another browser window
- Register with different account
- Watch messages appear instantly!

## 📱 Features to Try

- ✅ **Multiple Rooms** - Create and join different rooms
- ✅ **Real-Time Chat** - Messages update instantly
- ✅ **Typing Indicator** - See when others are typing
- ✅ **Message Reactions** - Add emoji reactions
- ✅ **Dark Mode** - Toggle theme button
- ✅ **Online Status** - See who's online
- ✅ **Room Search** - Find rooms by name
- ✅ **Message Delete** - Delete your messages

## 📁 Important Files

```
CircL/
├── server/src/app.js          ← Backend Express app
├── server/src/server.js       ← Server entry point
├── client/src/App.jsx         ← Frontend main component
├── client/src/main.jsx        ← React entry point
├── .env                       ← Configuration (already set)
└── README.md                  ← Full documentation
```

## 🆘 Troubleshooting

### "MongoDB connection error"
```bash
# Make sure MongoDB is running
docker run -d -p 27017:27017 --name mongodb mongo
```

### "Port 5000 already in use"
```bash
# Change PORT in .env
# Or kill the process: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Cannot find module 'react'"
```bash
# Install dependencies
cd client && npm install
```

### Frontend won't connect to backend
- Check backend is running on port 5000
- Check `VITE_API_URL` in `client/.env`
- Default is `http://localhost:5000/api`

## 📚 More Resources

- **Full Setup Guide**: See `SETUP.md`
- **API Documentation**: See `server/README.md`
- **Implementation Details**: See `IMPLEMENTATION.md`
- **Project Overview**: See `README.md`

## 🎉 You're Done!

CircL is now running! 🚀

**Next Steps:**
1. Explore the app
2. Read the documentation
3. Try deploying to cloud (Heroku, Vercel, Railway, etc.)
4. Customize and extend features!

---

**Need help?** Check the documentation files or review the code comments.

**Happy chatting!** 💬

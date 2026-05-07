import 'dotenv/config';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initializeSockets } from './sockets/index.js';
import { startRoomExpiryJob } from './jobs/roomExpiry.job.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
    });

    // Initialize socket handlers
    initializeSockets(io);

    // Start background jobs
    startRoomExpiryJob();

    // Start listening
    server.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════╗`);
      console.log(`║  CircL Server Running              ║`);
      console.log(`║  Port: ${PORT}                            ║`);
      console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}        ║`);
      console.log(`╚════════════════════════════════════╝\n`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\nSIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

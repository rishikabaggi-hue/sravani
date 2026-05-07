import cron from 'node-cron';
import Room from '../models/Room.model.js';
import Message from '../models/Message.model.js';

export const startRoomExpiryJob = () => {
  // Check every minute for expired rooms
  const job = cron.schedule('*/1 * * * *', async () => {
    try {
      const now = new Date();

      // Find expired temporary rooms
      const expiredRooms = await Room.find({
        isTemporary: true,
        expiresAt: { $lt: now },
      });

      if (expiredRooms.length > 0) {
        console.log(`Found ${expiredRooms.length} expired rooms to clean up`);

        for (const room of expiredRooms) {
          try {
            // Delete messages in the room
            await Message.deleteMany({ room: room._id });

            // Delete the room
            await Room.findByIdAndDelete(room._id);

            console.log(`✓ Deleted expired room: ${room.name}`);
          } catch (error) {
            console.error(`Failed to delete room ${room._id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Room expiry job error:', error);
    }
  });

  console.log('✓ Room expiry job started');
  return job;
};

export const stopRoomExpiryJob = (job) => {
  if (job) {
    job.stop();
    console.log('✓ Room expiry job stopped');
  }
};

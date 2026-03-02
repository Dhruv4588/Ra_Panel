import Queue from 'bullmq';
import admin from 'firebase-admin';
import User from '../Models/UserModel.js';

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Redis Connection (Docker or local)
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379
};

// Notification Queue (processes 1000 users/batch)
export const notificationQueue = new Queue('notifications', { connection });

// Batch processor (1000 users per job)
notificationQueue.process('sendBatch', 2, async (job) => { // 2 concurrent workers
  const { community, subCommunity, title, content, raName } = job.data;
  
  console.log(`📤 Processing batch: ${community}_${subCommunity}`);
  
  // Get users in batches of 1000
  const users = await User.find({
    'subscribedCommunities': {
      $elemMatch: {
        community,
        subCommunity,
        notifications: true
      }
    }
  }).select('fcmToken').limit(1000);
  
  const messages = users.map(user => ({
    token: user.fcmToken,
    notification: {
      title: `🚨 TRADE ALERT - ${community.toUpperCase()}`,
      body: `${title}: ${content.substring(0, 100)}`,
      image: 'https://yourapp.com/trade-icon.png'
    },
    data: {
      community,
      subCommunity,
      type: 'trade_alert'
    }
  }));
  
  // Send batch via FCM
  const response = await admin.messaging().sendEach(messages);
  
  console.log(`✅ Batch sent: ${response.successCount}/${response.failureCount} FCMs`);
  return { success: response.successCount, failed: response.failureCount };
});

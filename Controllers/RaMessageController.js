// controllers/raMessageController.js
import Message from '../Models/Message.js';  
import Ra from '../Models/RaModel.js';
import { notificationQueue } from '../Services/notificationQueue.js';

export const createTradeMessage = async (req, res) => {
  try {
    const { community, subCommunity, title, content } = req.body;
    const raId = req.ra._id;
    
    // 1. Save message to MongoDB
    const message = new Message({
      raId,
      community,
      subCommunity,
      messageType: 'trade',
      title,
      content,
      isNotification: true
    });
    await message.save();
    
    // 2. Queue FCM batch notification
    const job = await notificationQueue.add('sendBatch', {
      community,
      subCommunity,
      title,
      content,
      raName: req.ra.name
    });
    
    // 3. WebSocket real-time (immediate)
    io.to(`${community}_${subCommunity}`).emit('tradeAlert', {
      messageId: message._id,
      title,
      content,
      raName: req.ra.name
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Trade alert queued & sent!',
      data: { 
        messageId: message._id,
        queueJobId: job.id,
        estimatedDelivery: '5-10 seconds'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Queue status
export const getQueueStatus = async (req, res) => {
  const jobs = await notificationQueue.getJobs(['waiting', 'active', 'completed']);
  res.json({ 
    success: true,
    queueLength: await notificationQueue.getWaitingCount(),
    activeJobs: jobs.length,
    processed: await notificationQueue.getCompletedCount()
  });
};

// ✅ Get RA's own messages
export const getMyMessages = async (req, res) => {
  try {
    const raId = req.ra._id;
    
    const messages = await Message.find({ raId })
      .populate('raId', 'name contact')
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json({ 
      success: true, 
      count: messages.length,
      data: messages 
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages' 
    });
  }
};

// ✅ Send notifications to subCommunity users
const sendPushNotifications = async (message) => {
  try {
    // Find users subscribed to this subCommunity
    const users = await User.find({
      subscribedCommunities: {
        $elemMatch: {
          community: message.community,
          subCommunity: message.subCommunity,
          notifications: true
        }
      }
    }).select('fcmToken');
    
    // Send FCM push notifications
    for (const user of users) {
      if (user.fcmToken) {
        await sendFCMPush(user.fcmToken, message);
      }
    }
    
    // Socket.io real-time
    io.to(`${message.community}_${message.subCommunity}`).emit('tradeAlert', {
      messageId: message._id,
      title: message.title,
      content: message.content
    });
    
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// ✅ FCM Push Notification Helper
const sendFCMPush = async (fcmToken, message) => {
  const admin = require('firebase-admin');
  
  const payload = {
    notification: {
      title: `🚨 TRADE - ${message.community.toUpperCase()}`,
      body: `${message.title}: ${message.content.substring(0, 100)}`,
      icon: 'trade_icon'
    },
    data: {
      messageId: message._id.toString(),
      type: 'trade_alert'
    }
  };
  
  await admin.messaging().send({
    token: fcmToken,
    ...payload
  });
};

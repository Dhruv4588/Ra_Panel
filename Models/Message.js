// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // RA who sent the message
  raId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ra',
    required: true,
    index: true
  },
  
  // Main Community
  community: {
    type: String,
    enum: ['nifty', 'equity', 'commodities', 'swing'],
    required: true,
    index: true
  },
  
  // Sub Community (NF1, NF2, etc.)
  subCommunity: {
    type: String,
    enum: [
      // Nifty
      'nf1', 'nf2', 'nf3', 'nf4', 'nf5', 'np1', 'np2', 'np3',
      // Equity  
      'eq1', 'eq2', 'eq3',
      // Commodities
      'gc1', 'gc2', 'sl1', 'sl2',
      // Swing
      'sw1', 'sw2', 'sw3'
    ],
    required: true,
    index: true
  },
  
  // Message Type
  messageType: {
    type: String,
    enum: ['trade', 'promotional', 'followup', 'flaunt'],
    required: true,
    index: true
  },
  
  // Message Content
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Notification Flag (Only 'trade' messages)
  isNotification: {
    type: Boolean,
    default: false
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for fast queries
messageSchema.index({ community: 1, subCommunity: 1, createdAt: -1 });
messageSchema.index({ raId: 1, createdAt: -1 });
messageSchema.index({ messageType: 1, isNotification: 1 });

export default mongoose.model('Message', messageSchema);

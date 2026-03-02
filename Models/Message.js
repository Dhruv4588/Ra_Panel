// Models/Message.js - Complete Production Schema
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  raId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ra', 
    required: true,
    index: true 
  },
  community: { 
    type: String, 
    enum: ['nifty', 'equity', 'commodities', 'swing'], 
    required: true,
    index: true 
  },
  subCommunity: { 
    type: String, 
    enum: ['nf1','nf2','nf3','np1','eq1','eq2','gc1','gc2','sw1','sw2'], 
    required: true,
    index: true 
  },
  messageType: { 
    type: String, 
    enum: ['trade','promotional','followup','flaunt'], 
    required: true 
  },
  title: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 500 },
  
  // 🔥 Timestamps & Analytics
  sentAt: { type: Date, default: Date.now, index: true },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24*60*60*1000), // 24h expiry
    index: true,
    expires: '24h' // Auto-delete after 24h
  },
  
  // 🔥 Delivery Stats
  delivery: {
    queuedAt: Date,
    sentAt: Date,
    totalUsers: { type: Number, default: 0 },
    successful: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  
  // 🔥 User Seen Tracking (First 100 users + summary)
  seenBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seenAt: { type: Date, default: Date.now }
  }],
  seenCount: { type: Number, default: 0 }, // Total seen
  firstSeenAt: Date,
  lastSeenAt: Date
}, {
  timestamps: true
});

// 🔥 Indexes for fast analytics
messageSchema.index({ community: 1, subCommunity: 1, sentAt: -1 });
messageSchema.index({ raId: 1, sentAt: -1 });
messageSchema.index({ expiresAt: 1 });

export default mongoose.model('Message', messageSchema);

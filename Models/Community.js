// models/Community.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  raId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ra', required: true },
  community: { 
    type: String, 
    enum: ['nifty', 'equity', 'commodities', 'swing'],
    required: true 
  },
  subCommunity: { 
    type: String, 
    enum: ['nf1','nf2','nf3','np1', /* add others */],
    required: true 
  },
  messageType: { 
    type: String, 
    enum: ['trade', 'promotional', 'followup', 'flaunt'],
    required: true 
  },
  title: String,
  content: String,
  isNotification: { type: Boolean, default: false }, // Only 'trade' = true
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);

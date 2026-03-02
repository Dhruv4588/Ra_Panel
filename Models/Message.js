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
    enum: [
      
      'nf1', 'nf2', 'nf3',  'np1',
      
      'eqf1', 'eqf2', 'eqf3','eqp1',
      
      'cf1', 'cf2', 'cf3', 'cp1',
   
      'stf1', 'stf2', 'stf3','stp1'
    ],
    required: true,
    index: true
  },
  
  
  messageType: {
    type: String,
    enum: ['trade', 'promotional', 'followup', 'flaunt'],
    required: true,
    index: true
  },
  
 
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
  

  isNotification: {
    type: Boolean,
    default: false
  },
  
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


messageSchema.index({ community: 1, subCommunity: 1, createdAt: -1 });
messageSchema.index({ raId: 1, createdAt: -1 });
messageSchema.index({ messageType: 1, isNotification: 1 });

export default mongoose.model('Message', messageSchema);

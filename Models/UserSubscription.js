// models/UserSubscription.js
const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subscriptions: [{
    community: {
      type: String,
      enum: ['nifty', 'equity', 'commodities', 'swing']
    },
    subCommunity: {
      type: String,
      enum: ['nf1', 'nf2', 'nf3', /* all subs */]
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }]
}, { timestamps: true });

export default mongoose.model('UserSubscription', userSubscriptionSchema);

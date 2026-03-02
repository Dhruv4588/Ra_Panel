import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use valid email']
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    trim: true,
    minlength: [8, 'Password min 8 chars'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      'Password must be 8+ chars with 1 uppercase, 1 lowercase, 1 special char (!@#$%^&*)'
    ]
  },
  avatar: { 
    type: String,
    default: 'data:image/webp;base64,UklGRr...' // Your base64
  },
  gender: { 
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not valid gender'
    },
    required: [true, 'Gender required']
  },
  dob: { 
    type: Date,
    required: [true, 'Date of birth required']
  },
  subscribedCommunities: [{
    community: {
      type: String,
      enum: ['nifty', 'equity', 'commodities', 'swing']
    },
    subCommunity: {
      type: String,
      enum: ['nf1','nf2','nf3','np1','eq1','gc1','sw1']
    },
    notifications: { type: Boolean, default: true }
  }],
  fcmToken: {
    type: String,
    sparse: true  // Allow multiple nulls
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

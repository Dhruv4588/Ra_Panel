import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  

const RaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Contact must be exactly 10 digits']
  },
  password: {
    type: String,
    required: true,
    minlength: 8  
  },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['ra', 'admin'], default: 'ra' }
}, {
  timestamps: true
});


RaSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Ra = mongoose.model('Ra', RaSchema);
export default Ra;

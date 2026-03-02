import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import raRoutes from './Routers/RaRouter.js';
import userRoutes from './Routers/UserRouter.js';

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json({ limit: '10mb' }));


mongoose.connect(
  process.env.MONGODB_URI || 
  'mongodb://admin:password123@localhost:27017/myapp?authSource=admin'
)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));


app.use('/api/ra', raRoutes);
app.use('/api/users', userRoutes);


app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

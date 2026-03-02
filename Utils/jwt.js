// utils/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// Generate RA Token (7 days expiry)
export const generateRaToken = (raId) => {
  return jwt.sign(
    { id: raId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify Token
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Middleware for RA routes
export const raAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    const decoded = verifyToken(token);
    req.ra = decoded; // { id: raId }
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

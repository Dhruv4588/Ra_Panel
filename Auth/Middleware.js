import jwt from 'jsonwebtoken';
import Ra from '../Models/RaModel.js';

export const raAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const ra = await Ra.findById(decoded.id).select('-password');
    
    if (!ra || !ra.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid RA' });
    }
    
    req.ra = ra;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

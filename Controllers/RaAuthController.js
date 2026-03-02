// controllers/raAuthController.js
import Ra from '../Models/RaModel.js';
import bcrypt from 'bcryptjs';
import { generateRaToken } from '../Utils/jwt.js';

export const raLogin = async (req, res) => {
  try {
    const { contact, password } = req.body;
    
    // Find RA
    const ra = await Ra.findOne({ contact });
    if (!ra || !await bcrypt.compare(password, ra.password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const token = generateRaToken(ra._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        ra: {
          id: ra._id,
          name: ra.name,
          contact: ra.contact
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

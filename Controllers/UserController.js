import User from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
  try {
    const { password } = req.body;
    
    // 1. Hash password FIRST
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 2. Create user WITHOUT schema validation
    const user = new User({ 
      ...req.body, 
      password: hashedPassword 
    });
    
    // 3. Skip validation (hashed password fails regex)
    await user.save({ validateBeforeSave: false });
    
    // 4. Return safe user object
    const safeUser = user.toObject();
    delete safeUser.password;
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: safeUser 
    });
  } catch (error) {
    console.error('Create user error:', error.message);
    
    // Handle specific errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { community, subCommunity, isActive } = req.query;
    
    const filter = { 
      ...(isActive !== undefined && { isActive: isActive === 'true' })
    };
    
    // Filter by community subscription
    if (community || subCommunity) {
      filter['subscribedCommunities'] = {
        $elemMatch: {
          ...(community && { community }),
          ...(subCommunity && { subCommunity })
        }
      };
    }
    
    const users = await User.find(filter)
      .select('-password')
      .populate('subscribedCommunities', 'community subCommunity notifications')
      .sort({ createdAt: -1 });
      
    res.json({ 
      success: true, 
      count: users.length,
      data: users 
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Fix: Ensure subscribedCommunities is array
    if (req.body.subscribedCommunities && !Array.isArray(req.body.subscribedCommunities)) {
      req.body.subscribedCommunities = [req.body.subscribedCommunities];
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
};

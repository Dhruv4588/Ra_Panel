import express from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../Controllers/UserController.js';

const router = express.Router();

// Query parameter validation middleware
const validateQuery = (req, res, next) => {
  const { community, subCommunity, isActive } = req.query;
  if (community && !['nifty','equity','commodities','swing'].includes(community)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid community' 
    });
  }
  next();
};

// Routes with query validation
router.route('/')
  .get(validateQuery, getAllUsers)    // Supports ?community=nifty&subCommunity=nf1
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .patch(updateUser)                 // ✅ Added PATCH support
  .delete(deleteUser);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'User API healthy' });
});

export default router;

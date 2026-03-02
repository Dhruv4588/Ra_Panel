// Controllers/RaController.js
import Ra from '../Models/RaModel.js';
import bcrypt from 'bcryptjs';

export const createTradeMessage = async (req, res) => {
  try {
    const { community, subCommunity, title, content } = req.body;
    const raId = req.ra._id;
    
    // Count users before sending
    const userCount = await User.countDocuments({
      'subscribedCommunities': {
        $elemMatch: { community, subCommunity, notifications: true }
      }
    });
    
    const message = new Message({
      raId,
      community,
      subCommunity,
      messageType: 'trade',
      title,
      content,
      isNotification: true,
      'delivery.totalUsers': userCount
    });
    
    await message.save();
    
    // Queue notification with message reference
    await notificationQueue.add('sendBatch', {
      messageId: message._id,
      community,
      subCommunity,
      title,
      content,
      raName: req.ra.name
    });
    
    res.status(201).json({
      success: true,
      message: 'Trade alert sent!',
      data: {
        messageId: message._id,
        reach: userCount,
        estimatedDelivery: '5-10s'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRa = async (req, res) => {
  const raList = await Ra.find().select('-password');
  res.json({ success: true, data: raList });
};

export const getRaById = async (req, res) => {
  const ra = await Ra.findById(req.params.id).select('-password');
  if (!ra) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: ra });
};

export const updateRa = async (req, res) => {
  const ra = await Ra.findByIdAndUpdate(req.params.id, req.body, { 
    new: true, 
    runValidators: true 
  }).select('-password');
  if (!ra) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: ra });
};

export const patchRa = async (req, res) => {
  const ra = await Ra.findByIdAndUpdate(req.params.id, { $set: req.body }, { 
    new: true, 
    runValidators: true 
  }).select('-password');
  if (!ra) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: ra });
};

export const deleteRa = async (req, res) => {
  await Ra.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
};

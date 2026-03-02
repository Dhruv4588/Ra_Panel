// Controllers/RaController.js
import Ra from '../Models/RaModel.js';
import bcrypt from 'bcryptjs';

export const createRa = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const ra = new Ra({ ...req.body, password: hashedPassword });
    await ra.save();
    res.status(201).json({ success: true, data: ra });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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

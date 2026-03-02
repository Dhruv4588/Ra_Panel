import express from 'express';
import { 
  createRa, 
  getAllRa, 
  getRaById, 
  updateRa, 
  patchRa, 
  deleteRa 
} from '../Controllers/RaController.js';

const router = express.Router();

// ✅ CORRECT Routes
router.route('/')
  .post(createRa)
  .get(getAllRa);

router.route('/:id')
  .get(getRaById)
  .put(updateRa)
  .patch(patchRa)
  .delete(deleteRa);

export default router;

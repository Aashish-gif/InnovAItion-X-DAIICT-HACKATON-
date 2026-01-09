import express from 'express';
import {
  saveProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All project routes are protected
router.use(verifyToken);

router.post('/save', saveProject);
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;

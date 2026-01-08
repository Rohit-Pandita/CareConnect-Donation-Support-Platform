import express from 'express';
import multer from 'multer';
import * as requestController from '../controllers/requestController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Create request (caretakers only)
router.post('/', authMiddleware, roleMiddleware('caretaker'), upload.single('image'), requestController.createRequest);

// Get all requests (public)
router.get('/', requestController.getRequests);

// Get single request
router.get('/:id', requestController.getRequestById);

// Get user's requests (authenticated)
router.get('/user/my-requests', authMiddleware, requestController.getUserRequests);

// Update request (caretakers)
router.put('/:id', authMiddleware, roleMiddleware('caretaker'), requestController.updateRequest);

// Delete request (caretakers and admin)
router.delete('/:id', authMiddleware, requestController.deleteRequest);

// Update request status
router.patch('/:id/status', authMiddleware, requestController.updateRequestStatus);

export default router;

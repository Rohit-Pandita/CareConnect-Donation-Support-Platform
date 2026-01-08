import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Add comment
router.post('/:requestId/comments', authMiddleware, commentController.addComment);

// Get comments for a request
router.get('/:requestId/comments', commentController.getComments);

// Delete comment
router.delete('/:requestId/comments/:commentId', authMiddleware, commentController.deleteComment);

export default router;

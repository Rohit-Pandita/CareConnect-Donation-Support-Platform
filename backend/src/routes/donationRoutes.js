import express from 'express';
import * as donationController from '../controllers/donationController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get donor's donations (both paths supported)
router.get('/', authMiddleware, roleMiddleware('donor'), donationController.getDonations);
router.get('/my-donations', authMiddleware, roleMiddleware('donor'), donationController.getDonations);

// Accept request (donors only)
router.post('/requests/:requestId/accept', authMiddleware, roleMiddleware('donor'), donationController.acceptRequest);

// Update donation status
router.patch('/:donationId/status', authMiddleware, donationController.updateDonationStatus);

// Get caretaker contact info (for accepted requests)
router.get('/requests/:requestId/caretaker-contact', authMiddleware, roleMiddleware('donor'), donationController.getCadetakerContactInfo);

export default router;

import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers.js';
import * as DonationModel from '../models/Donation.js';
import * as RequestModel from '../models/Request.js';
import * as UserModel from '../models/User.js';

export const acceptRequest = async (req, res, next) => {
  try {
    const request = await RequestModel.getRequestById(req.params.requestId);
    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    const alreadyAccepted = await DonationModel.checkDonorAccepted(req.params.requestId, req.user.id);
    if (alreadyAccepted) {
      return sendErrorResponse(res, 409, 'You have already accepted this request');
    }

    const donationId = await DonationModel.createDonation({
      requestId: req.params.requestId,
      donorId: req.user.id,
      status: 'accepted',
    });

    // Update request status to accepted
    await RequestModel.updateRequestStatus(req.params.requestId, 'accepted');

    return sendSuccessResponse(res, 201, 'Request accepted', { donationId });
  } catch (error) {
    next(error);
  }
};

export const getDonations = async (req, res, next) => {
  try {
    const donations = await DonationModel.getDonorDonations(req.user.id);
    return sendSuccessResponse(res, 200, 'Donations fetched', donations);
  } catch (error) {
    next(error);
  }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const donation = await DonationModel.getDonationById(req.params.donationId);

    if (!donation) {
      return sendErrorResponse(res, 404, 'Donation not found');
    }

    if (donation.donor_id !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Not authorized');
    }

    await DonationModel.updateDonationStatus(req.params.donationId, status);

    // If delivered, update request status as well
    if (status === 'delivered') {
      await RequestModel.updateRequestStatus(donation.request_id, 'delivered');
    }

    return sendSuccessResponse(res, 200, 'Donation status updated');
  } catch (error) {
    next(error);
  }
};

export const getCadetakerContactInfo = async (req, res, next) => {
  try {
    const request = await RequestModel.getRequestById(req.params.requestId);
    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    // Check if user has accepted this request
    const donation = await DonationModel.checkDonorAccepted(req.params.requestId, req.user.id);
    if (!donation) {
      return sendErrorResponse(res, 403, 'You must accept the request first');
    }

    const caretaker = await UserModel.getUserById(request.created_by);
    const { password, ...safeData } = caretaker;

    return sendSuccessResponse(res, 200, 'Contact info fetched', safeData);
  } catch (error) {
    next(error);
  }
};

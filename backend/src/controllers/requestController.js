import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers.js';
import { createRequestValidation } from '../utils/validators.js';
import * as RequestModel from '../models/Request.js';
import * as DonationModel from '../models/Donation.js';

export const createRequest = async (req, res, next) => {
  try {
    const { error, value } = createRequestValidation(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const requestId = await RequestModel.createRequest({
      ...value,
      createdBy: req.user.id,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    return sendSuccessResponse(res, 201, 'Request created successfully', { requestId });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status,
      category: req.query.category,
      search: req.query.search,
      limit,
      offset,
    };

    const requests = await RequestModel.getAllRequests(filters);
    const totalCount = await RequestModel.getRequestsCount(filters);

    return sendSuccessResponse(res, 200, 'Requests fetched', {
      requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await RequestModel.getRequestById(req.params.id);
    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    const donations = await DonationModel.getDonationsByRequest(req.params.id);
    return sendSuccessResponse(res, 200, 'Request fetched', { ...request, donations });
  } catch (error) {
    next(error);
  }
};

export const getUserRequests = async (req, res, next) => {
  try {
    const requests = await RequestModel.getUserRequests(req.user.id);
    return sendSuccessResponse(res, 200, 'User requests fetched', requests);
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const request = await RequestModel.getRequestById(req.params.id);
    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    if (request.created_by !== req.user.id) {
      return sendErrorResponse(res, 403, 'Not authorized to update this request');
    }

    await RequestModel.updateRequest(req.params.id, req.body);
    const updatedRequest = await RequestModel.getRequestById(req.params.id);

    return sendSuccessResponse(res, 200, 'Request updated', updatedRequest);
  } catch (error) {
    next(error);
  }
};

export const deleteRequest = async (req, res, next) => {
  try {
    const request = await RequestModel.getRequestById(req.params.id);
    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    if (request.created_by !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Not authorized to delete this request');
    }

    await RequestModel.deleteRequest(req.params.id);
    return sendSuccessResponse(res, 200, 'Request deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await RequestModel.getRequestById(req.params.id);

    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    if (request.created_by !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Not authorized');
    }

    await RequestModel.updateRequestStatus(req.params.id, status);
    return sendSuccessResponse(res, 200, 'Status updated');
  } catch (error) {
    next(error);
  }
};

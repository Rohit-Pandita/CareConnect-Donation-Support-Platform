import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers.js';
import { commentValidation } from '../utils/validators.js';
import * as CommentModel from '../models/Comment.js';
import * as RequestModel from '../models/Request.js';
import * as DonationModel from '../models/Donation.js';

export const addComment = async (req, res, next) => {
  try {
    const { error, value } = commentValidation(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const request = await RequestModel.getRequestById(req.params.requestId);
    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    // Allow comment if:
    // 1. User is the caretaker who created the request, OR
    // 2. User is a donor who accepted the request, OR
    // 3. User is admin
    const isDonorAccepted = await DonationModel.checkDonorAccepted(req.params.requestId, req.user.id);
    const isCaretakerOwner = request.user_id === req.user.id && req.user.role === 'caretaker';
    
    if (!isDonorAccepted && !isCaretakerOwner && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'You must be the caretaker or an accepted donor to message');
    }

    const commentId = await CommentModel.createComment({
      requestId: req.params.requestId,
      userId: req.user.id,
      content: value.content,
    });

    return sendSuccessResponse(res, 201, 'Message sent', { commentId });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.getCommentsByRequest(req.params.requestId);
    return sendSuccessResponse(res, 200, 'Comments fetched', comments);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.getCommentById(req.params.commentId);
    if (!comment) {
      return sendErrorResponse(res, 404, 'Comment not found');
    }

    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Not authorized to delete this comment');
    }

    await CommentModel.deleteComment(req.params.commentId);
    return sendSuccessResponse(res, 200, 'Comment deleted');
  } catch (error) {
    next(error);
  }
};

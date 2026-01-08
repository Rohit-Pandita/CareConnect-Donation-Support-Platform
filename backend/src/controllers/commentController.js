import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers.js';
import { commentValidation } from '../utils/validators.js';
import * as CommentModel from '../models/Comment.js';
import * as RequestModel from '../models/Request.js';

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

    const commentId = await CommentModel.createComment({
      requestId: req.params.requestId,
      userId: req.user.id,
      content: value.content,
    });

    return sendSuccessResponse(res, 201, 'Comment added', { commentId });
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

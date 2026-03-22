import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const query = { recipient: req.user._id };
  if (unreadOnly === 'true') {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
        unreadCount,
      },
      'Notifications retrieved successfully'
    )
  );
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});

// @desc    Create notification (Admin)
// @route   POST /api/notifications
// @access  Private (Admin)
export const createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message, type, link } = req.body;

  const notification = await Notification.create({
    recipient,
    title,
    message,
    type,
    link,
  });

  // Emit socket event
  const io = req.app.get('io');
  io.to(recipient.toString()).emit('notification:new', notification);

  res.status(201).json(new ApiResponse(201, notification, 'Notification created successfully'));
});

import { Router } from 'express';
import {
    createUserNotification,
    getNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
} from '../controllers/notification-controller';

const router = Router();

// Route to create a new notification
router.post('/', createUserNotification);

// Route to get all notifications for a user
router.get('/:userId', getNotifications);

// Route to get a single notification by ID
router.get('/notification/:id', getNotificationById);

// Route to update a notification
router.patch('/:id', updateNotification);

// Route to delete a notification
router.delete('/:id', deleteNotification);

export default router;

/**
 * Notification Service
 * 
 * Invitational, optional notification system.
 * Never implies failure or creates pressure.
 * 
 * Example tone: "A quiet moment is available if you need it."
 */

// Types
export * from './types';
export type {
  NotificationType,
  NotificationPriority,
  NotificationContent,
  Notification,
  NotificationPreferences,
  NotificationSchedule,
  NotificationResult,
} from './types';

// Templates
export * from './templates';
export {
  NOTIFICATION_TEMPLATES,
  getNotificationTemplate,
  getNotificationTemplateByIndex,
  validateNotificationContent,
} from './templates';

// Service
export * from './notificationService';
export {
  NotificationService,
  getNotificationService,
  resetNotificationService,
} from './notificationService';

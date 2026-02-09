/**
 * Notification Service
 * 
 * Invitational, optional notification system.
 * Never implies failure or creates pressure.
 */

import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationContent,
  NotificationPreferences,
  NotificationSchedule,
  NotificationResult,
} from './types';
import { getNotificationTemplate, validateNotificationContent } from './templates';

/**
 * Default notification preferences
 * All notifications are optional by default
 */
const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: false, // Disabled by default - user must opt in
  quietMoments: false,
  gentleReminders: false,
  roomInvitations: false,
  alignmentInvitations: false,
};

/**
 * Notification Service
 * Manages invitational notifications
 */
export class NotificationService {
  private preferences: NotificationPreferences;
  private scheduledNotifications: Notification[] = [];

  constructor(preferences?: Partial<NotificationPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...preferences };
  }

  /**
   * Gets current preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Updates preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
  }

  /**
   * Checks if notifications are enabled
   */
  isEnabled(): boolean {
    return this.preferences.enabled;
  }

  /**
   * Checks if a specific notification type is enabled
   */
  isTypeEnabled(type: NotificationType): boolean {
    if (!this.preferences.enabled) {
      return false;
    }

    switch (type) {
      case NotificationType.QUIET_MOMENT:
        return this.preferences.quietMoments ?? false;
      case NotificationType.GENTLE_REMINDER:
        return this.preferences.gentleReminders ?? false;
      case NotificationType.ROOM_INVITATION:
        return this.preferences.roomInvitations ?? false;
      case NotificationType.ALIGNMENT_INVITATION:
        return this.preferences.alignmentInvitations ?? false;
      default:
        return false;
    }
  }

  /**
   * Checks if current time is within quiet hours
   */
  isQuietHours(): boolean {
    if (!this.preferences.quietHours) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = this.preferences.quietHours;

    // Handle quiet hours that span midnight
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }

    return currentTime >= start && currentTime <= end;
  }

  /**
   * Creates a notification
   */
  createNotification(
    type: NotificationType,
    options?: {
      actionUrl?: string;
      scheduledFor?: Date;
      customContent?: NotificationContent;
    }
  ): Notification {
    const content = options?.customContent || getNotificationTemplate(type);

    // Validate content
    const validation = validateNotificationContent(content);
    if (!validation.valid) {
      // Fallback to safe template
      const safeContent = getNotificationTemplate(type);
      return this.createNotificationWithContent(type, safeContent, options);
    }

    return this.createNotificationWithContent(type, content, options);
  }

  /**
   * Creates notification with specific content
   */
  private createNotificationWithContent(
    type: NotificationType,
    content: NotificationContent,
    options?: {
      actionUrl?: string;
      scheduledFor?: Date;
    }
  ): Notification {
    return {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      priority: NotificationPriority.LOW,
      scheduledFor: options?.scheduledFor,
      actionUrl: options?.actionUrl,
    };
  }

  /**
   * Sends a notification (invitational, optional)
   */
  async sendNotification(
    type: NotificationType,
    options?: {
      actionUrl?: string;
      customContent?: NotificationContent;
    }
  ): Promise<NotificationResult> {
    // Check if notifications are enabled
    if (!this.isEnabled()) {
      return {
        success: false,
        skipped: true,
        reason: 'Notifications are disabled',
      };
    }

    // Check if this type is enabled
    if (!this.isTypeEnabled(type)) {
      return {
        success: false,
        skipped: true,
        reason: `Notification type ${type} is disabled`,
      };
    }

    // Check quiet hours
    if (this.isQuietHours()) {
      return {
        success: false,
        skipped: true,
        reason: 'Currently in quiet hours',
      };
    }

    try {
      const notification = this.createNotification(type, options);

      // In a real implementation, this would use a notification library
      // For now, we'll just mark it as delivered
      notification.deliveredAt = new Date();

      // Store notification
      this.scheduledNotifications.push(notification);

      return {
        success: true,
        notificationId: notification.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Schedules a notification
   */
  scheduleNotification(
    type: NotificationType,
    scheduledFor: Date,
    options?: {
      actionUrl?: string;
      customContent?: NotificationContent;
    }
  ): Notification {
    const notification = this.createNotification(type, {
      ...options,
      scheduledFor,
    });

    this.scheduledNotifications.push(notification);
    return notification;
  }

  /**
   * Gets scheduled notifications
   */
  getScheduledNotifications(): readonly Notification[] {
    return [...this.scheduledNotifications];
  }

  /**
   * Cancels a scheduled notification
   */
  cancelNotification(notificationId: string): boolean {
    const index = this.scheduledNotifications.findIndex(
      n => n.id === notificationId
    );
    if (index === -1) {
      return false;
    }

    this.scheduledNotifications.splice(index, 1);
    return true;
  }

  /**
   * Marks notification as read
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.scheduledNotifications.find(
      n => n.id === notificationId
    );
    if (!notification) {
      return false;
    }

    notification.readAt = new Date();
    return true;
  }

  /**
   * Clears all notifications
   */
  clearAll(): void {
    this.scheduledNotifications = [];
  }
}

/**
 * Global notification service instance
 */
let globalNotificationService: NotificationService | null = null;

/**
 * Gets or creates the global notification service
 */
export function getNotificationService(): NotificationService {
  if (!globalNotificationService) {
    globalNotificationService = new NotificationService();
  }
  return globalNotificationService;
}

/**
 * Resets the global notification service (for testing)
 */
export function resetNotificationService(): void {
  globalNotificationService = null;
}

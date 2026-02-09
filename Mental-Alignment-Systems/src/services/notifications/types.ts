/**
 * Notification Service Types
 * 
 * Invitational, optional notifications.
 * Never implies failure or creates pressure.
 */

/**
 * Notification Type
 * Different types of gentle invitations
 */
export enum NotificationType {
  QUIET_MOMENT = 'quiet_moment', // A quiet moment is available
  GENTLE_REMINDER = 'gentle_reminder', // Gentle reminder (not urgent)
  ROOM_INVITATION = 'room_invitation', // Invitation to a room
  ALIGNMENT_INVITATION = 'alignment_invitation', // Invitation to alignment
}

/**
 * Notification Priority
 * All notifications are low priority - never urgent
 */
export enum NotificationPriority {
  LOW = 'low', // Default - always low priority
}

/**
 * Notification Content
 * Invitational, gentle content
 */
export interface NotificationContent {
  title: string; // Short, gentle title
  body: string; // Invitational message
  tone: 'invitational' | 'gentle' | 'quiet'; // Tone of the notification
}

/**
 * Notification
 * Complete notification object
 */
export interface Notification {
  id: string;
  type: NotificationType;
  content: NotificationContent;
  priority: NotificationPriority;
  scheduledFor?: Date; // Optional scheduling
  deliveredAt?: Date; // When it was delivered
  readAt?: Date; // When user read it
  actionUrl?: string; // Optional deep link
}

/**
 * Notification Preferences
 * User preferences for notifications (all optional)
 */
export interface NotificationPreferences {
  enabled: boolean; // Master switch
  quietMoments: boolean; // Quiet moment invitations
  gentleReminders: boolean; // Gentle reminders
  roomInvitations: boolean; // Room invitations
  alignmentInvitations: boolean; // Alignment invitations
  quietHours?: {
    start: string; // e.g., "22:00"
    end: string; // e.g., "08:00"
  };
}

/**
 * Notification Schedule
 * When to send notifications (gentle, not frequent)
 */
export interface NotificationSchedule {
  type: NotificationType;
  frequency: 'daily' | 'weekly' | 'custom';
  timeOfDay?: string; // e.g., "09:00", "18:00"
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
}

/**
 * Notification Result
 * Result of sending a notification
 */
export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  error?: string;
  skipped?: boolean; // If skipped due to preferences or quiet hours
  reason?: string; // Why it was skipped
}

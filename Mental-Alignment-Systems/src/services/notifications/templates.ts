/**
 * Notification Templates
 * 
 * Invitational, gentle notification templates.
 * Never implies failure or creates pressure.
 */

import { NotificationContent, NotificationType } from './types';

/**
 * Notification Template
 * Pre-defined gentle, invitational messages
 */
export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationContent[]> = {
  [NotificationType.QUIET_MOMENT]: [
    {
      title: 'A quiet moment',
      body: 'A quiet moment is available if you need it.',
      tone: 'invitational',
    },
    {
      title: 'Gentle space',
      body: 'A gentle space is here when you\'re ready.',
      tone: 'gentle',
    },
    {
      title: 'Quiet invitation',
      body: 'A quiet space awaits, if you wish.',
      tone: 'quiet',
    },
    {
      title: 'Stillness available',
      body: 'A moment of stillness is available, if you need it.',
      tone: 'invitational',
    },
  ],

  [NotificationType.GENTLE_REMINDER]: [
    {
      title: 'When you\'re ready',
      body: 'A space for reflection is here when you\'re ready.',
      tone: 'gentle',
    },
    {
      title: 'No pressure',
      body: 'A quiet space is available, whenever you need it.',
      tone: 'invitational',
    },
    {
      title: 'At your pace',
      body: 'A moment for presence is here, at your own pace.',
      tone: 'gentle',
    },
  ],

  [NotificationType.ROOM_INVITATION]: [
    {
      title: 'Room invitation',
      body: 'A quiet room is available if you\'d like to visit.',
      tone: 'invitational',
    },
    {
      title: 'Gentle space',
      body: 'A gentle space awaits, if you wish to enter.',
      tone: 'gentle',
    },
    {
      title: 'Quiet room',
      body: 'A quiet room is here, whenever you\'re ready.',
      tone: 'quiet',
    },
  ],

  [NotificationType.ALIGNMENT_INVITATION]: [
    {
      title: 'Alignment space',
      body: 'A space for alignment is available, if you need it.',
      tone: 'invitational',
    },
    {
      title: 'When ready',
      body: 'An alignment session is here when you\'re ready.',
      tone: 'gentle',
    },
    {
      title: 'Gentle invitation',
      body: 'A gentle alignment space awaits, if you wish.',
      tone: 'invitational',
    },
  ],
};

/**
 * Gets a random template for a notification type
 */
export function getNotificationTemplate(type: NotificationType): NotificationContent {
  const templates = NOTIFICATION_TEMPLATES[type];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

/**
 * Gets a specific template by index
 */
export function getNotificationTemplateByIndex(
  type: NotificationType,
  index: number
): NotificationContent {
  const templates = NOTIFICATION_TEMPLATES[type];
  return templates[index % templates.length];
}

/**
 * Validates notification content against guardrails
 * Ensures no pressure-inducing language
 */
export function validateNotificationContent(content: NotificationContent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const text = `${content.title} ${content.body}`.toLowerCase();

  // Check for pressure patterns
  const pressurePatterns = [
    'you should',
    'you need to',
    'you must',
    "you haven't",
    "you're behind",
    'catch up',
    'don\'t forget',
    'last chance',
    'missed',
    'failed',
  ];

  pressurePatterns.forEach(pattern => {
    if (text.includes(pattern)) {
      errors.push(`Contains pressure pattern: "${pattern}"`);
    }
  });

  // Check for failure implications
  const failurePatterns = [
    'you missed',
    'you forgot',
    'you didn\'t',
    'failure',
    'failed',
    'error',
  ];

  failurePatterns.forEach(pattern => {
    if (text.includes(pattern)) {
      errors.push(`Implies failure: "${pattern}"`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

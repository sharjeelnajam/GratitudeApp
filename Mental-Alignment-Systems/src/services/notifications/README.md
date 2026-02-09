# Notification Service

Invitational, optional notification system. Never implies failure or creates pressure.

## Principles

- **Optional** - All notifications are opt-in
- **Invitational** - Gentle invitations, not demands
- **Never implies failure** - No "you missed" or "you forgot" language
- **Low priority** - All notifications are low priority, never urgent
- **Quiet hours** - Respects user's quiet time

## Example Tone

> "A quiet moment is available if you need it."

Not:
- ❌ "You haven't checked in today"
- ❌ "Don't forget to reflect"
- ❌ "You missed your session"
- ❌ "Last chance to..."

## Usage

### Basic Setup

```typescript
import { getNotificationService, NotificationType } from '@/services/notifications';

const service = getNotificationService();

// Enable notifications (user must opt in)
service.updatePreferences({
  enabled: true,
  quietMoments: true,
  gentleReminders: true,
});
```

### Sending Notifications

```typescript
// Send a quiet moment invitation
const result = await service.sendNotification(NotificationType.QUIET_MOMENT, {
  actionUrl: '/align', // Optional deep link
});

if (result.success) {
  console.log('Notification sent');
} else if (result.skipped) {
  console.log(`Skipped: ${result.reason}`);
}
```

### Notification Types

```typescript
// Quiet moment invitation
await service.sendNotification(NotificationType.QUIET_MOMENT);

// Gentle reminder
await service.sendNotification(NotificationType.GENTLE_REMINDER);

// Room invitation
await service.sendNotification(NotificationType.ROOM_INVITATION, {
  actionUrl: '/rooms/fireplace',
});

// Alignment invitation
await service.sendNotification(NotificationType.ALIGNMENT_INVITATION, {
  actionUrl: '/align',
});
```

### Scheduling Notifications

```typescript
// Schedule a notification for later
const notification = service.scheduleNotification(
  NotificationType.QUIET_MOMENT,
  new Date('2024-12-25T09:00:00'),
  {
    actionUrl: '/align',
  }
);

// Cancel scheduled notification
service.cancelNotification(notification.id);
```

### Preferences

```typescript
// Get current preferences
const prefs = service.getPreferences();
console.log(prefs.enabled); // false by default

// Update preferences
service.updatePreferences({
  enabled: true,
  quietMoments: true,
  gentleReminders: false,
  roomInvitations: true,
  alignmentInvitations: false,
  quietHours: {
    start: '22:00',
    end: '08:00',
  },
});
```

### Checking Status

```typescript
// Check if notifications are enabled
if (service.isEnabled()) {
  // Send notification
}

// Check if specific type is enabled
if (service.isTypeEnabled(NotificationType.QUIET_MOMENT)) {
  // Send quiet moment notification
}

// Check if in quiet hours
if (service.isQuietHours()) {
  // Don't send notification
}
```

## Notification Templates

### Quiet Moment

- "A quiet moment is available if you need it."
- "A gentle space is here when you're ready."
- "A quiet space awaits, if you wish."
- "A moment of stillness is available, if you need it."

### Gentle Reminder

- "A space for reflection is here when you're ready."
- "A quiet space is available, whenever you need it."
- "A moment for presence is here, at your own pace."

### Room Invitation

- "A quiet room is available if you'd like to visit."
- "A gentle space awaits, if you wish to enter."
- "A quiet room is here, whenever you're ready."

### Alignment Invitation

- "A space for alignment is available, if you need it."
- "An alignment session is here when you're ready."
- "A gentle alignment space awaits, if you wish."

## Design Philosophy Compliance

✅ **Optional** - All notifications are opt-in  
✅ **Invitational** - Gentle invitations, not demands  
✅ **Never implies failure** - No "you missed" language  
✅ **Low priority** - Never urgent or demanding  
✅ **Respectful** - Respects quiet hours and preferences  

## Guardrails

The service automatically validates notification content:

```typescript
import { validateNotificationContent } from '@/services/notifications';

const content = {
  title: 'A quiet moment',
  body: 'A quiet moment is available if you need it.',
  tone: 'invitational',
};

const validation = validateNotificationContent(content);
if (!validation.valid) {
  console.error(validation.errors);
  // Content contains forbidden patterns
}
```

## What NOT to Include

When creating notification content, avoid:

- ❌ "You haven't checked in today"
- ❌ "Don't forget to reflect"
- ❌ "You missed your session"
- ❌ "Last chance to..."
- ❌ "You're behind"
- ❌ "Catch up"
- ❌ Any language that implies failure or creates pressure

## What TO Include

Instead, use:

- ✅ "A quiet moment is available if you need it."
- ✅ "A gentle space is here when you're ready."
- ✅ "A quiet space awaits, if you wish."
- ✅ Invitational, optional language
- ✅ Gentle, calm tone

## Quiet Hours

Respect user's quiet time:

```typescript
service.updatePreferences({
  quietHours: {
    start: '22:00', // 10 PM
    end: '08:00',   // 8 AM
  },
});

// Notifications won't be sent during quiet hours
```

## Default Behavior

- **Disabled by default** - User must opt in
- **All types disabled** - User enables specific types
- **Low priority** - Never urgent
- **Respects quiet hours** - Won't send during quiet time

## Integration

### With Alignment Sessions

```typescript
// After session, optionally invite to return
if (userHasOptedIn) {
  await notificationService.sendNotification(
    NotificationType.ALIGNMENT_INVITATION,
    { actionUrl: '/align' }
  );
}
```

### With Rooms

```typescript
// Invite to a specific room
await notificationService.sendNotification(
  NotificationType.ROOM_INVITATION,
  { actionUrl: '/rooms/fireplace' }
);
```

## Future Enhancements

Potential additions (still following design philosophy):
- Custom notification templates (user-authored)
- Gentle frequency limits (not too frequent)
- Context-aware timing (gentle suggestions)
- Deep linking to specific content

## Best Practices

1. **Always check preferences** - Don't send if disabled
2. **Respect quiet hours** - Never send during quiet time
3. **Use invitational language** - Never demand or pressure
4. **Low frequency** - Don't send too often
5. **Optional always** - User can disable anytime

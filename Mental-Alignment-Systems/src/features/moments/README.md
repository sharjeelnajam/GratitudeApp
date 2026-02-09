# Saved Moments Feature

A quiet memory space for saved moments and intentions. Like a constellation of gentle reflections.

## Principles

- **No streaks** - No consecutive day tracking
- **No counts** - No "you have X moments" messaging
- **No progress bars** - No visual progress indicators
- **Quiet memory space** - Like a constellation, not a dashboard
- **Gentle presence** - Moments exist without pressure

## Overview

The moments feature allows users to:
- Save moments of gratitude and reflection
- Save intentions for quiet reflection
- View moments in a calm, non-metric way
- Filter moments by card, room, or date
- Edit or remove moments gently

## Usage

### Saving a Moment

```typescript
import { getMomentsManager } from '@/features/moments';

const manager = getMomentsManager();

// Save a moment
const moment = manager.saveMoment(
  'I am grateful for this quiet morning',
  {
    cardId: 'card-1',
    roomId: 'room-fireplace',
    emotionalStateId: 'state-1',
    card: cardObject, // Optional: include card for reference
  }
);
```

### Saving an Intention

```typescript
import { getMomentsManager } from '@/features/moments';
import { createIntention } from '@/domain';

const manager = getMomentsManager();

// Create and save intention
const intention = createIntention('intention-1', 'Be present with gratitude');
manager.saveIntention(intention);
```

### Getting Moments

```typescript
const manager = getMomentsManager();

// Get all moments (newest first)
const allMoments = manager.getAllMoments();

// Get moments with filter
const filteredMoments = manager.getAllMoments({
  roomId: 'room-fireplace',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
  },
}, MomentSortOrder.OLDEST_FIRST);

// Get moments for a specific card
const cardMoments = manager.getMomentsForCard('card-1');

// Get moments for a specific room
const roomMoments = manager.getMomentsForRoom('room-fireplace');
```

### Getting Intentions

```typescript
const manager = getMomentsManager();

// Get all saved intentions
const intentions = manager.getAllIntentions();
```

### Getting Collection

```typescript
const manager = getMomentsManager();

// Get full collection (like a constellation)
const collection = manager.getCollection();
console.log(collection.moments); // All moments
console.log(collection.intentions); // All intentions
console.log(collection.lastUpdated); // Last update time
```

### Updating a Moment

```typescript
const manager = getMomentsManager();

// Update moment content
const updated = manager.updateMoment('moment-1', 'Updated reflection');
if (updated) {
  console.log('Moment updated');
}
```

### Removing a Moment

```typescript
const manager = getMomentsManager();

// Remove a moment (gentle, no pressure)
const removed = manager.removeMoment('moment-1');
if (removed) {
  console.log('Moment removed');
}
```

## Design Philosophy

### Constellation Metaphor

Moments are like stars in a constellation:
- Each moment is unique and beautiful
- They exist together without comparison
- No counting or ranking
- Just presence and quiet reflection

### Quiet Memory Space

The moments feature feels like:
- A quiet room where memories rest
- A gentle collection without pressure
- A space for reflection, not achievement
- Presence over progress

## Filtering

Simple filtering without analytics:

```typescript
const filter: MomentFilter = {
  cardId: 'card-1', // Moments from a specific card
  roomId: 'room-fireplace', // Moments from a specific room
  emotionalStateId: 'state-1', // Moments with specific emotional state
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
  },
};
```

## Sorting

Simple chronological sorting (no performance metrics):

```typescript
import { MomentSortOrder } from '@/features/moments';

// Newest first (default)
const newest = manager.getAllMoments(undefined, MomentSortOrder.NEWEST_FIRST);

// Oldest first
const oldest = manager.getAllMoments(undefined, MomentSortOrder.OLDEST_FIRST);
```

## Design Philosophy Compliance

✅ **No streaks** - No consecutive day tracking  
✅ **No counts** - No "you have X moments" messaging  
✅ **No progress bars** - No visual progress indicators  
✅ **Quiet presence** - Moments exist without pressure  
✅ **Gentle collection** - Like a constellation, not a dashboard  

## What NOT to Include

When building UI for this feature, avoid:

- ❌ "You have 42 moments" counters
- ❌ "7 day streak" indicators
- ❌ Progress bars showing "completion"
- ❌ "Most viewed" or "most liked" sorting
- ❌ Achievement badges for milestones
- ❌ Comparison with other users
- ❌ Performance metrics

## What TO Include

Instead, focus on:

- ✅ Simple chronological list
- ✅ Gentle filtering options
- ✅ Quiet, reverent presentation
- ✅ Constellation-like visualization (optional)
- ✅ Calm, non-demanding UI
- ✅ Presence-focused design

## Example: Constellation View (Conceptual)

A constellation view could show:
- Moments as gentle points of light
- No labels or counts
- Just presence and quiet beauty
- Filtering by room creates different "constellations"
- Each moment is a star, together they form a gentle pattern

## Integration with Other Features

### Alignment Sessions

```typescript
// During alignment session
const manager = getMomentsManager();
const moment = manager.saveMoment(
  reflectionContent,
  {
    cardId: currentCard.id,
    roomId: currentRoom.id,
  }
);
```

### Content Service

```typescript
// When saving a moment from a card
const card = await cardEngine.getCard();
const moment = manager.saveMoment(
  userReflection,
  {
    cardId: card.id,
    card: card, // Include card for reference
  }
);
```

## Storage

In a real implementation, moments would be stored:
- Locally (AsyncStorage/SecureStore)
- Encrypted for privacy
- Synced to cloud (optional, user-controlled)
- Never shared or analyzed

## Future Enhancements

Potential additions (still following design philosophy):
- Gentle search (not analytics-based)
- Room-based collections
- Quiet export (for personal use only)
- Gentle reminders (opt-in, no pressure)

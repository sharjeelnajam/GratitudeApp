# Domain Models

Pure domain models with no UI or external dependencies. These represent the core business logic of the Mental Alignment System.

## Principles

- **No React or UI imports** - Pure TypeScript
- **No medical/clinical terminology** - Non-diagnostic language only
- **No progress metrics** - No scoring, tracking, or performance indicators
- **Immutable** - Models use `readonly` properties and return new instances on updates
- **Single Responsibility** - Each model has one clear purpose

## Models

### EmotionalState
Non-diagnostic, optional emotional state. Simple labels like "calm", "reflective", "present" - no clinical terms.

```typescript
import { createEmotionalState, EMOTIONAL_STATE_LABELS } from '@/domain';

const state = createEmotionalState(
  'id-1',
  EMOTIONAL_STATE_LABELS.CALM,
  'A sense of quiet presence'
);
```

### AlignmentSession
Represents a single alignment session. No progress tracking - just presence and reflection.

```typescript
import { createAlignmentSession, completeAlignmentSession } from '@/domain';

const session = createAlignmentSession('session-1', new Date(), {
  emotionalStateId: 'state-1',
  intentionId: 'intention-1',
});
```

### GuidedRoom
A room that provides gentle guidance and reflection. Not therapeutic - just a space for presence.

```typescript
import { createGuidedRoom } from '@/domain';

const room = createGuidedRoom('room-1', 'Quiet Space', 'A calm room for reflection', {
  colorPalette: { primary: '#8B5CF6', secondary: '#A78BFA', background: '#F9FAFB' },
  atmosphere: 'calm',
});
```

### Card
Reflective content - prompts, reflections, or gentle invitations. No advice-giving language.

```typescript
import { createCard, CARD_TYPES } from '@/domain';

const card = createCard('card-1', 'Notice what you feel grateful for in this moment', CARD_TYPES.INVITATION);
```

### Intention
What a user wishes to focus on or be present with. Not a goal - just an intention for presence.

```typescript
import { createIntention } from '@/domain';

const intention = createIntention('intention-1', 'Be present with gratitude');
```

### SavedMoment
A moment of gratitude or reflection that's been saved. Personal and private - no sharing or comparison.

```typescript
import { createSavedMoment } from '@/domain';

const moment = createSavedMoment('moment-1', 'I am grateful for this quiet morning', {
  cardId: 'card-1',
  roomId: 'room-1',
});
```

### BreakoutRoomSession
A session within a breakout room - a focused space for reflection. No completion metrics.

```typescript
import { createBreakoutRoomSession, endBreakoutRoomSession } from '@/domain';

const session = createBreakoutRoomSession('session-1', 'room-1');
const ended = endBreakoutRoomSession(session);
```

## Immutability

All models are immutable. Update functions return new instances:

```typescript
// ❌ Don't mutate
session.completedAt = new Date(); // Error: readonly property

// ✅ Create new instance
const updated = completeAlignmentSession(session);
```

## Design Philosophy Compliance

All models comply with the design philosophy:

- ✅ No gamification (no scores, streaks, achievements)
- ✅ No social features (no sharing, comparison)
- ✅ No clinical language (no diagnosis, therapy, treatment)
- ✅ No progress metrics (no tracking, completion rates)
- ✅ No advice-giving (no "you should", prescriptive content)
- ✅ Focus on presence and alignment

## Usage

Import from the domain index:

```typescript
import {
  EmotionalState,
  AlignmentSession,
  GuidedRoom,
  Card,
  Intention,
  SavedMoment,
  BreakoutRoomSession,
  createEmotionalState,
  createAlignmentSession,
  // ... etc
} from '@/domain';
```

# Alignment Session Feature

State machine implementation for alignment session flow.

## Overview

The alignment session follows a deterministic sequence of phases:

1. **Arrival & Stillness** - A moment to arrive and be still
2. **Guided Breathing** - Gentle guidance for presence
3. **Private Intention** - Set an intention for this session
4. **Card Reflection** - Reflect on a card
5. **Optional Sharing** - Optionally share your reflection (can be skipped)
6. **Closing** - A gentle closing

## Principles

- **Deterministic transitions** - Phases must be completed in order
- **No skipping phases** - Except optional sharing
- **Calm pacing** - Each phase has appropriate timing
- **Logic only** - No UI, pure state management

## Usage

### Creating a Session

```typescript
import { AlignmentSessionManager } from '@/features/alignment';

// Create a new session
const manager = AlignmentSessionManager.create('session-1', {
  emotionalStateId: 'state-1',
  roomId: 'room-fireplace',
});
```

### Getting Current State

```typescript
const state = manager.getState();
console.log(state.currentPhase); // AlignmentPhase.ARRIVAL_AND_STILLNESS
console.log(state.phaseStatuses); // Status of each phase
```

### Proceeding Through Phases

```typescript
// Proceed to next phase
const result = manager.proceedToNext();
if (result.success) {
  console.log('Moved to next phase');
} else {
  console.error(result.error);
}
```

### Setting Intention

```typescript
// Set intention during Private Intention phase
manager.setIntention('Be present with gratitude');
```

### Card Reflection

```typescript
// Set current card
manager.setCurrentCard('card-1');

// Save a moment
manager.saveMoment('I am grateful for this quiet morning');
```

### Skipping Optional Sharing

```typescript
// Skip optional sharing (only from Card Reflection phase)
const result = manager.skipSharing();
if (result.success) {
  console.log('Skipped sharing, moved to closing');
}
```

### Completing Session

```typescript
// Complete the session
manager.completeSession();
const isComplete = manager.isComplete(); // true
```

## State Machine

### Phases

```typescript
enum AlignmentPhase {
  ARRIVAL_AND_STILLNESS = 'arrival_and_stillness',
  GUIDED_BREATHING = 'guided_breathing',
  PRIVATE_INTENTION = 'private_intention',
  CARD_REFLECTION = 'card_reflection',
  OPTIONAL_SHARING = 'optional_sharing',
  CLOSING = 'closing',
}
```

### Phase Status

```typescript
enum PhaseStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped', // Only for optional phases
}
```

### Transition Rules

1. **Sequential progression** - Can only move to next phase
2. **No skipping** - Cannot skip phases (except optional sharing)
3. **Completion required** - Current phase must be completed or in progress
4. **Optional sharing** - Can be skipped from Card Reflection to Closing

## Phase Configuration

Each phase has:
- `name` - Display name
- `description` - Description
- `duration` - Optional duration in milliseconds (for calm pacing)
- `isOptional` - Whether phase can be skipped
- `canProceed` - Whether user can manually proceed

## Example Flow

```typescript
// 1. Create session
const manager = AlignmentSessionManager.create('session-1');

// 2. Arrival & Stillness (starts automatically)
// Wait for user to proceed...

// 3. Proceed to Guided Breathing
manager.proceedToNext();

// 4. Proceed to Private Intention
manager.proceedToNext();

// 5. Set intention
manager.setIntention('Be present');

// 6. Proceed to Card Reflection
manager.proceedToNext();

// 7. Set card and save moment
manager.setCurrentCard('card-1');
manager.saveMoment('I am grateful...');

// 8. Option A: Proceed to Optional Sharing
manager.proceedToNext();
// ... sharing logic ...

// Option B: Skip Optional Sharing
manager.skipSharing();

// 9. Proceed to Closing (or auto-complete)
manager.proceedToNext();

// 10. Complete session
manager.completeSession();
```

## Design Philosophy Compliance

✅ **No metrics** - No progress tracking or scoring  
✅ **No pressure** - User controls pacing  
✅ **Calm transitions** - Gentle, contemplative flow  
✅ **Presence-focused** - Not goal-oriented  
✅ **Deterministic** - Predictable, reliable state machine  

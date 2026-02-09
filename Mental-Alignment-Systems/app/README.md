# Navigation Structure

Minimal, declarative navigation using Expo Router.

## Routes

### `/` - Entry Screen
Calm entry point to the app. Gentle, reverent welcome.

**File:** `app/index.tsx`

### `/align` - Alignment Session
A space for alignment work. Presence-focused, no metrics.

**File:** `app/align.tsx`

### `/rooms/[roomType]` - Guided Alignment Room
Dynamic route for different room types:
- `fireplace` - Warm, cozy atmosphere
- `ocean` - Calm, serene atmosphere
- `forest` - Grounding, natural atmosphere
- `nightSky` - Deep, contemplative atmosphere

**File:** `app/rooms/[roomType].tsx`

**Usage:**
```typescript
router.push('/rooms/fireplace');
router.push('/rooms/ocean');
```

### `/close` - Quiet Closing
A gentle, reverent closing experience. No pressure, no urgency.

**File:** `app/close.tsx`

## Navigation Principles

- **No dashboards** - No progress tracking or metrics
- **No tabs** - Simple stack navigation
- **No metrics** - Presence-focused, not performance-focused
- **Declarative** - Routes defined by file structure
- **Expandable** - Easy to add new routes

## Adding New Routes

To add a new route:

1. Create a new file in `app/` directory
2. File name becomes the route path
3. Use dynamic routes with `[param]` for parameters
4. Follow the calm, reverent design philosophy

**Example:**
```typescript
// app/moments.tsx
export default function MomentsScreen() {
  // ...
}
```

## Navigation Helpers

Use Expo Router's navigation:

```typescript
import { useRouter } from 'expo-router';

function MyComponent() {
  const router = useRouter();
  
  // Navigate
  router.push('/align');
  router.push('/rooms/fireplace');
  
  // Go back
  router.back();
  
  // Replace current screen
  router.replace('/close');
}
```

## Route Parameters

Access route parameters:

```typescript
import { useLocalSearchParams } from 'expo-router';

function DynamicScreen() {
  const { paramName } = useLocalSearchParams();
  // ...
}
```

## Design Philosophy

All routes must:
- ✅ Be calm and reverent
- ✅ Use shared UI components
- ✅ Follow theme system
- ✅ No metrics or progress tracking
- ✅ Presence-focused, not goal-focused

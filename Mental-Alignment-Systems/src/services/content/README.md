# Content Service

Reflective card content engine that delivers cards without analyzing users or relying on history.

## Principles

- **No user analysis** - Cards are delivered without personalization
- **No history tracking** - No reliance on user history or behavior
- **Offline fallback** - Content always available, even offline
- **Content protection** - Authored content is protected and verified
- **Simple delivery** - Respectful, straightforward content delivery

## Structure

```
src/services/content/
├── types.ts              # Type definitions
├── cardEngine.ts         # Main card delivery engine
├── offlineContent.ts     # Offline card library
├── contentProtection.ts  # Content protection & verification
└── index.ts              # Exports
```

## Usage

### Basic Card Delivery

```typescript
import { CardEngine } from '@/services/content';

// Create engine
const engine = new CardEngine({
  offlineEnabled: true,
  contentProtectionEnabled: true,
  defaultStrategy: CardSelectionStrategy.RANDOM,
});

// Get a random card
const result = await engine.getCard();
if (result.success) {
  console.log(result.card.content);
}
```

### Filtered Card Delivery

```typescript
import { CardEngine, CardFilter } from '@/services/content';

const engine = new CardEngine();

// Get card by category
const filter: CardFilter = {
  category: 'gratitude',
  type: 'prompt',
};

const result = await engine.getCard(filter);
if (result.success) {
  console.log(result.card.content);
}
```

### Get Card by ID

```typescript
const engine = new CardEngine();

const result = await engine.getCardById('offline-gratitude-1');
if (result.success) {
  console.log(result.card.content);
}
```

### Room-Specific Cards

```typescript
const engine = new CardEngine();

// Get card for a specific room
const result = await engine.getCard({
  roomId: 'room-fireplace',
  category: 'gratitude',
});
```

## Card Selection Strategies

### Random (Default)
```typescript
const engine = new CardEngine({
  defaultStrategy: CardSelectionStrategy.RANDOM,
});
```

### Sequential
```typescript
const engine = new CardEngine({
  defaultStrategy: CardSelectionStrategy.SEQUENTIAL,
});
```

### Category-Based
```typescript
const engine = new CardEngine({
  defaultStrategy: CardSelectionStrategy.CATEGORY,
});
```

## Offline Content

The service includes a curated library of offline cards:

- **Arrival & Stillness** - Cards for arrival moments
- **Gratitude** - Gratitude reflection cards
- **Presence** - Presence and mindfulness cards
- **Alignment** - Alignment-focused cards

All offline cards are:
- Always available
- Protected content
- No network required

## Content Protection

### Verify Content Integrity

```typescript
import { validateContentIntegrity, isContentProtected } from '@/services/content';

const card = result.card;

// Check if content is protected
if (isContentProtected(card)) {
  // Validate integrity
  const validation = validateContentIntegrity(card);
  if (validation.isValid) {
    console.log('Content is valid');
  }
}
```

### Content Signatures

```typescript
import { createContentSignature, verifyContentSignature } from '@/services/content';

// Create signature
const signature = createContentSignature(card);

// Verify signature
const verification = verifyContentSignature(card, signature);
if (verification.isValid) {
  console.log('Content verified');
}
```

## Card Types

### Text Cards
Standard reflective cards with text content.

```typescript
{
  id: 'card-1',
  content: 'Notice what you feel grateful for in this moment.',
  type: 'prompt',
  category: 'gratitude',
}
```

### Audio Cards (Future-Ready)
Cards with audio content (structure ready, implementation pending).

```typescript
{
  id: 'card-audio-1',
  content: 'Listen to this guided reflection.',
  type: 'invitation',
  audioUrl: 'https://...', // Future implementation
  duration: 300000, // 5 minutes
}
```

## Design Philosophy Compliance

✅ **No user analysis** - Cards delivered without personalization  
✅ **No history tracking** - No reliance on user behavior  
✅ **Respectful delivery** - Simple, straightforward content  
✅ **Offline-first** - Content always available  
✅ **Content protection** - Authored content is protected  

## Future Enhancements

- **Audio card support** - Full audio card implementation
- **Remote content sync** - Optional remote content updates
- **Content versioning** - Version management for content updates
- **Advanced protection** - Enhanced content protection mechanisms

## Error Handling

The service always returns a result, even on error:

```typescript
const result = await engine.getCard();

if (!result.success) {
  console.error(result.error);
  // Fallback card is always provided
  console.log(result.card.content); // Safe fallback
}
```

## Best Practices

1. **Always check success** - Verify `result.success` before using card
2. **Use filters appropriately** - Filter by category, type, or room
3. **Respect content protection** - Validate content when protection is enabled
4. **Handle offline gracefully** - Service works offline by default
5. **No personalization** - Don't try to personalize based on user data

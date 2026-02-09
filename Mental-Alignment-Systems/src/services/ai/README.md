# AI Service

AI alignment service abstraction for content selection, tone suggestion, and modality selection.

## Principles

- **NO API keys** - No external API dependencies
- **NO direct provider SDKs** - Abstracted interface only
- **NO chatbot behavior** - No conversational AI
- **Guardrails enforced** - Prevents forbidden language and behaviors

## Responsibilities

The AI service is responsible for:

1. **Content Selection** - Selects appropriate content based on context (not user analysis)
2. **Tone Suggestion** - Suggests tone for content delivery
3. **Modality Selection** - Chooses text or audio delivery

## Guardrails

The service enforces strict guardrails:

- ❌ **No diagnosis language** - No medical or clinical terminology
- ❌ **No emotional labeling** - No "you are", "you feel" language
- ❌ **No follow-up questioning** - No conversational prompts
- ❌ **No prescriptive content** - No "you should" language

## Usage

### Basic Usage

```typescript
import { AIServiceFactory } from '@/services/ai';

// Create AI service (currently mock implementation)
const aiService = AIServiceFactory.create();

// Select content
const contentResult = await aiService.selectContent({
  context: {
    roomId: 'room-fireplace',
    timeOfDay: 'evening',
  },
  availableCards: cards,
});

if (contentResult.success && contentResult.data) {
  console.log(contentResult.data.selectedCard.content);
  console.log(contentResult.data.reasoning);
}
```

### Tone Suggestion

```typescript
const toneResult = await aiService.suggestTone({
  context: {
    roomId: 'room-ocean',
    timeOfDay: 'morning',
  },
});

if (toneResult.success && toneResult.data) {
  console.log(toneResult.data.tone); // CALM, GENTLE, QUIET, etc.
}
```

### Modality Selection

```typescript
const modalityResult = await aiService.selectModality({
  context: {
    userPreference: ModalityType.TEXT,
    availableModalities: [ModalityType.TEXT, ModalityType.AUDIO],
  },
});

if (modalityResult.success && modalityResult.data) {
  console.log(modalityResult.data.modality); // TEXT or AUDIO
}
```

## Mock Implementation

The current implementation is a **mock service** that:

- Uses simple heuristics (not real AI)
- Simulates AI behavior for development
- Enforces guardrails
- No external dependencies

### Mock Behavior

- **Content Selection**: Random selection with context filtering
- **Tone Suggestion**: Based on room type and time of day
- **Modality Selection**: Defaults to text, respects user preference

## Guardrails

### Content Validation

```typescript
import { validateContentGuardrails } from '@/services/ai';

const result = validateContentGuardrails(card.content);
if (!result.passed) {
  console.error(result.reason);
  // Content was filtered
}
```

### Reasoning Validation

```typescript
import { validateReasoningGuardrails } from '@/services/ai';

const result = validateReasoningGuardrails(aiReasoning);
if (!result.passed) {
  // Reasoning contains forbidden patterns
}
```

### Content Sanitization

```typescript
import { sanitizeContent } from '@/services/ai';

const sanitized = sanitizeContent(content);
if (sanitized === null) {
  // Too much content was removed, use fallback
}
```

## Design Philosophy Compliance

✅ **No user analysis** - Content selection based on context, not user data  
✅ **No chatbot behavior** - No conversational AI or follow-up questions  
✅ **No diagnosis language** - Guardrails prevent clinical terminology  
✅ **No emotional labeling** - Prevents "you are", "you feel" language  
✅ **Respectful suggestions** - Simple, non-prescriptive recommendations  

## Future Implementation

When implementing a real AI service:

1. **Implement IAIAlignmentService** - Follow the interface contract
2. **Enforce guardrails** - Use guardrail functions before returning results
3. **No API keys in code** - Use environment variables or secure storage
4. **No chatbot behavior** - Keep responses simple and non-conversational
5. **Respect design philosophy** - No personalization, no diagnosis, no labeling

## Example: Real AI Implementation (Future)

```typescript
class RealAIService implements IAIAlignmentService {
  async selectContent(request: ContentSelectionRequest) {
    // 1. Validate guardrails on input
    // 2. Call AI provider (with API key from secure storage)
    // 3. Validate guardrails on output
    // 4. Return result
  }
  
  // ... other methods
}
```

## Error Handling

All methods return `AIServiceResponse<T>`:

```typescript
const result = await aiService.selectContent(request);

if (!result.success) {
  console.error(result.error);
  // Handle error - fallback to default content
}

if (result.guardrailsApplied) {
  // Guardrails were applied - content was filtered
}
```

## Configuration

```typescript
const aiService = AIServiceFactory.create({
  enableContentSelection: true,
  enableToneSuggestion: true,
  enableModalitySelection: true,
  strictGuardrails: true,
});

// Update config
aiService.updateConfig({
  strictGuardrails: false, // Less strict (not recommended)
});
```

## Best Practices

1. **Always check success** - Verify `result.success` before using data
2. **Respect guardrails** - Never bypass guardrail checks
3. **Use mock for development** - No need for real AI during development
4. **Validate all outputs** - Check guardrails on AI responses
5. **No personalization** - Don't use user data for content selection

/**
 * Reflection questions by room.
 * Each room has one or more sections (heading + questions).
 */

export type RoomType = 'fireplace' | 'ocean' | 'forest' | 'nightSky';

export interface QuestionSection {
  heading: string;
  questions: string[];
}

export interface RoomQuestionsConfig {
  roomType: RoomType;
  sections: QuestionSection[];
}

const SELF_AWARENESS_EMOTIONS: QuestionSection = {
  heading: 'Self-Awareness & Emotions',
  questions: [
    'When the night has come, how do you feel?',
    'When your mind is quiet, what thoughts bring you peace?',
    'Which emotion visits you most often today, and how does it feel?',
    'What part of yourself are you proud of right now?',
    'When you feel strong, where does it show in your body?',
    'How does your heart feel when you are calm?',
    'When sadness comes, what comforts you?',
    'What makes you feel safe inside yourself?',
    'How do you notice your feelings without judgment?',
    'Which small win today can you celebrate?',
  ],
};

const RESILIENCE_STRENGTH: QuestionSection = {
  heading: 'Resilience & Strength',
  questions: [
    'In moments of challenge, where do you feel your strength?',
    'What helps you keep going when things are hard?',
    'When you fall, what reminds you to rise again?',
    'How do you handle worries that feel too big?',
    'Which past experience shows your courage?',
    'What does confidence feel like in your body?',
    'How can you be kind to yourself in difficult moments?',
    'When you face fear, what helps you breathe through it?',
    'What is one thing you can do today to feel empowered?',
    'When things change suddenly, what helps you stay grounded?',
  ],
};

const JOY_GRATITUDE: QuestionSection = {
  heading: 'Joy & Gratitude',
  questions: [
    'What small joy today can you hold onto?',
    'Which memory makes you smile when you revisit it?',
    'What is something you are thankful for right now?',
    'Who or what lifts your spirit when the day feels long?',
    'When you notice beauty around you, how does it feel?',
    'What simple pleasure makes your heart light?',
    'How does nature make you feel calm and connected?',
    'When someone makes you laugh, how does it change your day?',
    'Which sound or song brings you peace?',
    'How do you show gratitude to yourself or others?',
  ],
};

const MINDFULNESS_PRESENCE: QuestionSection = {
  heading: 'Mindfulness & Presence',
  questions: [
    'When your body feels heavy, what helps you breathe easier?',
    'What does calm feel like in your body right now?',
    'How do your senses guide you in this moment?',
    'When you focus on one breath, what changes?',
    'What part of your day deserves your full attention?',
    'How can you pause and notice the small wonders around you?',
    'What does stillness teach you?',
    'How do your thoughts shift when you slow down?',
    'What can you let go of to feel lighter today?',
    'When you close your eyes, what peaceful place do you imagine?',
  ],
};

const SELF_GROWTH_REFLECTION: QuestionSection = {
  heading: 'Self-Growth & Reflection',
  questions: [
    'What small step today shows your courage?',
    'Which words feel like a soft embrace to your heart?',
    'How do you celebrate yourself in quiet moments?',
    'What part of your day can you thank yourself for?',
    'When you try something new, what do you learn about yourself?',
    'How do you respond when someone misunderstands you?',
    'What dream feels worth pursuing right now?',
    'Which skill or talent makes you feel capable?',
    'How do your actions today align with your values?',
    'What does "being your best self" mean to you today?',
  ],
};

/**
 * Room-to-questions mapping:
 * - Fireplace: Self-Awareness & Emotions
 * - Ocean: Joy & Gratitude
 * - Forest: Resilience & Strength + Self-Growth & Reflection
 * - Night Sky: Mindfulness & Presence
 */
export const ROOM_QUESTIONS: Record<RoomType, RoomQuestionsConfig> = {
  fireplace: {
    roomType: 'fireplace',
    sections: [SELF_AWARENESS_EMOTIONS],
  },
  ocean: {
    roomType: 'ocean',
    sections: [JOY_GRATITUDE],
  },
  forest: {
    roomType: 'forest',
    sections: [RESILIENCE_STRENGTH, SELF_GROWTH_REFLECTION],
  },
  nightSky: {
    roomType: 'nightSky',
    sections: [MINDFULNESS_PRESENCE],
  },
};

export function getQuestionsForRoom(roomType: RoomType): RoomQuestionsConfig {
  return ROOM_QUESTIONS[roomType];
}

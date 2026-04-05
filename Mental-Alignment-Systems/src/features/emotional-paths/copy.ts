/** Client script copy for emotional regulation paths (non-clinical support). */

export const ANXIOUS = {
  pathLabel: 'Anxious path',
  introVoice:
    "I've got you. Your mind is racing, but your body is right here. We aren't going to 'think' our way out of this. We're going to breathe our way back to center. Just listen to the sound of my voice and follow the light on your screen.",
  breatheInhale: 'In through the nose... 2, 3, 4.',
  breatheHold: 'And hold... 2, 3, 4.',
  breatheExhale: 'Slowly out through the mouth... let the tension drop... 5, 6, 7, 8.',
  breathePhaseInhale: 'Breathe in',
  breathePhaseHold: 'Hold gently',
  breathePhaseExhale: 'Release',
  modalityTitle: 'Breathe Easy Therapy™',
  modalitySubtitle: '4 · 4 · 8 — three calm cycles',
  groundingIntro:
    "Your heart rate is starting to settle. Let's anchor you here. Look around you and find one blue object in the room. Tap the screen when you've found it.",
  groundingFeet:
    'Good. Now, notice the weight of your feet on the floor. Feel that connection for three seconds.',
  integration:
    'The storm is passing. You are safe, you are grounded, and you are in control of this moment. Carry this stillness with you as you move back into your day.',
  continueCta: 'Continue to completion',
  exitNotificationBody: 'Checking in—your breath is always a tool you can return to.',
} as const;

export const OVERWHELMED = {
  pathLabel: 'Overwhelmed path',
  introVoice:
    "I hear the noise in your mind, and it's okay to feel crowded. Right now, your only job is to stop carrying it all. For the next four minutes, the world can wait. We are going to move from 'too much' to 'just this.' Take one deep breath in... and let it out.",
  dumpPrompt:
    'What is the one thing weighing heaviest on you right now? Write it in one sentence.',
  dumpPlaceholder: 'One sentence...',
  reframeSetup:
    "I see it. That's a lot of weight. Now, let's change the game. We aren't going to solve everything at once. We are going to find the Single Pivot.",
  cardPrompt:
    'Look at your stressor again. If you could only do one of these, which provides the most relief?',
  pivotAffirmation:
    "That is your pivot. You've just turned a mountain into a single step. That is the Game Changer.",
  integration:
    "Notice your shoulders. Notice your breath. The list hasn't changed, but you have. You are no longer under the pile; you are standing in front of the first step. Take that feeling with you.",
  continueCta: 'Continue',
} as const;

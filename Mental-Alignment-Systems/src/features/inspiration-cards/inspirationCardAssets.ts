/**
 * Inspiration card images shown randomly from Home (modal).
 */

export const INSPIRATION_CARD_IMAGES = [
  require('../../../assets/inspiration-cards/inspiration1.jpeg'),
  require('../../../assets/inspiration-cards/inspiration2.jpeg'),
  require('../../../assets/inspiration-cards/inspiration3.jpeg'),
  require('../../../assets/inspiration-cards/inspiration4.jpeg'),
  require('../../../assets/inspiration-cards/inspiration5.jpeg'),
] as const;

export type InspirationCardImageSource = (typeof INSPIRATION_CARD_IMAGES)[number];

export function pickRandomInspirationIndex(): number {
  return Math.floor(Math.random() * INSPIRATION_CARD_IMAGES.length);
}

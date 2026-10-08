import cards from '../data/og-cards.json';

export function ogCardForPath(path: string) {
  const normalized = `${path.replace(/\/$/, '')}/`;
  return cards.find((card) => card.path === normalized)
    ?? cards.find((card) => card.path !== '/' && normalized.startsWith(card.path))
    ?? cards[0];
}

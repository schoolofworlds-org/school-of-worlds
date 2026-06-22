// XP / level helpers. Level thresholds every 500 XP (confirmed with product).
export const XP_PER_LEVEL = 500

export function levelFromXp(xp: number | null | undefined): number {
  return Math.floor((xp ?? 0) / XP_PER_LEVEL) + 1
}

// XP accumulated within the current level (0 .. XP_PER_LEVEL-1).
export function xpIntoLevel(xp: number | null | undefined): number {
  return (xp ?? 0) % XP_PER_LEVEL
}

// XP needed to reach the next level from the start of the current one.
export function xpForNextLevel(): number {
  return XP_PER_LEVEL
}

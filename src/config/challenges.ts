/**
 * Reading challenges configuration
 * Central configuration for all reading challenges across the site
 */

export interface ChallengeConfig {
  goal: number;
  color: string;
  completedColor?: string;
  postSlug?: string; // Optional link to the challenge announcement post
}

export const challengesConfig: Record<string, ChallengeConfig> = {
  "12-meses-12-clasicos-2016": {
    goal: 12,
    color: "#34d44a",
    completedColor: "#34d44a",
    postSlug: "reto-literario-12-meses-12-clasicos-2016",
  },
  "stephen-king": {
    goal: 93,
    color: "#d43434",
    postSlug: "reto-literario-stephen-king",
  },
  pesadillas: {
    goal: 60,
    color: "#e8a13b",
    postSlug: "reto-literario-pesadillas",
  },
  "155-libros": {
    goal: 155,
    color: "#2196f3",
    postSlug: "reto-literario-los-155-libros-que-debes-leer-antes-de-morir",
  },
};

/**
 * Get challenge configuration by slug
 */
export function getChallengeConfig(challengeSlug: string): ChallengeConfig {
  const config = challengesConfig[challengeSlug];
  if (!config) {
    throw new Error(`Challenge "${challengeSlug}" not found in configuration`);
  }
  return config;
}

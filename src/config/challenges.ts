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
    color: "#c47a1a", // Darker orange for better contrast (3.2:1 on #f3f9f7)
    postSlug: "reto-literario-pesadillas",
  },
  "155-libros": {
    goal: 155,
    color: "#1976d2", // Darker blue for better contrast (3.4:1 on #f3f9f7)
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

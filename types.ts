export enum Tier {
  S = 'S', // Legend
  A = 'A', // Elite
  B = 'B', // Advanced
  C = 'C', // Rising
  D = 'D', // Newbie
}

export interface UserProfile {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  castCount: number;
  // Approximated stats for the ranker
  recentLikes: number; // Last 30 casts
  recentReplies: number; // Last 30 casts
  castsPerWeek: number;
  accountAgeDays: number;
  verified: boolean;
}

export interface RankScore {
  totalScore: number;
  breakdown: {
    activityScore: number; // Weighted 0.4
    followerScore: number; // Weighted 0.3
    castFrequencyScore: number; // Weighted 0.2
    completenessScore: number; // Weighted 0.1
  };
  tier: Tier;
  rawMetrics: {
    engagementRate: number;
    growthRate: number; // 30 day growth approx
  };
  history: { date: string; value: number }[]; // For sparkline
}

export interface LeaderboardEntry {
  fid: number;
  username: string;
  rank: number;
  score: number;
  tier: Tier;
}

export type ScreenState = 'WELCOME' | 'CALCULATING' | 'RESULT' | 'COMPARE' | 'LEADERBOARD';

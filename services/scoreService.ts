import { RankScore, Tier, UserProfile } from '../types';

/**
 * Formula:
 * score = activityScore * 0.4 + followerScore * 0.3 + castFrequencyScore * 0.2 + profileCompletenessScore * 0.1
 */
export const calculateRank = (profile: UserProfile): RankScore => {
  // 1. Activity Score (0-100)
  // Based on recent engagement (likes + replies) normalized against a high-performer benchmark
  const engagementSum = profile.recentLikes + (profile.recentReplies * 2); // Replies worth more
  const ACTIVITY_CAP = 1000;
  const activityScore = Math.min(100, (engagementSum / ACTIVITY_CAP) * 100);

  // 2. Follower Score (0-100)
  // Logarithmic scale to be fair to mid-sized accounts
  // 10k followers = ~100 points
  const followerScore = Math.min(100, (Math.log10(Math.max(1, profile.followerCount)) / 4) * 100);

  // 3. Cast Frequency Score (0-100)
  // Target: 20 casts per week for max score
  const TARGET_CASTS_WEEK = 20;
  const castFrequencyScore = Math.min(100, (profile.castsPerWeek / TARGET_CASTS_WEEK) * 100);

  // 4. Profile Completeness (0-100)
  let completenessScore = 0;
  if (profile.bio.length > 10) completenessScore += 30;
  if (profile.pfpUrl) completenessScore += 30;
  if (profile.displayName) completenessScore += 20;
  if (profile.verified) completenessScore += 20;

  // Weighted Sum
  const totalScoreRaw = 
    (activityScore * 0.4) + 
    (followerScore * 0.3) + 
    (castFrequencyScore * 0.2) + 
    (completenessScore * 0.1);

  const totalScore = Math.round(totalScoreRaw);

  // Determine Tier
  let tier = Tier.D;
  if (totalScore >= 90) tier = Tier.S;
  else if (totalScore >= 75) tier = Tier.A;
  else if (totalScore >= 60) tier = Tier.B;
  else if (totalScore >= 40) tier = Tier.C;

  // Generate mock history for sparkline (last 7 days)
  const history = Array.from({ length: 7 }).map((_, i) => {
    // slight variance around the current score
    const variance = (Math.random() * 10) - 5; 
    return {
        date: `Day ${i + 1}`,
        value: Math.max(0, Math.min(100, totalScore + variance))
    };
  });

  return {
    totalScore,
    breakdown: {
      activityScore,
      followerScore,
      castFrequencyScore,
      completenessScore,
    },
    tier,
    rawMetrics: {
      engagementRate: (engagementSum / Math.max(1, profile.castCount)) * 100,
      growthRate: Math.random() * 5 // Mock growth rate
    },
    history
  };
};

export const getTierColor = (tier: Tier): string => {
  switch (tier) {
    case Tier.S: return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]';
    case Tier.A: return 'text-neon-purple drop-shadow-[0_0_8px_rgba(185,131,255,0.5)]';
    case Tier.B: return 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]';
    case Tier.C: return 'text-neon-green';
    default: return 'text-gray-400';
  }
};

export const getTierBadge = (tier: Tier): string => {
   switch (tier) {
    case Tier.S: return 'Legend';
    case Tier.A: return 'Elite';
    case Tier.B: return 'Advanced';
    case Tier.C: return 'Rising';
    default: return 'Newbie';
  }
}
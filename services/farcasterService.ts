import { UserProfile } from '../types';

// In a real app, this would use axios/fetch to hit a Hub API (e.g., Neynar, Hubble)
// Since we are in a client-side demo without a backend proxy, we verify logic using deterministic mocks.

const MOCK_PFP_BASE = "https://picsum.photos/seed";

// Pseudo-random number generator for deterministic results based on FID
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const fetchProfile = async (fid: number): Promise<UserProfile> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));

  const rand = (offset: number) => seededRandom(fid + offset);

  // Generate deterministic stats based on FID
  // Higher FIDs (newer users) generally have lower stats in this mock, but with variance
  const baseFactor = Math.max(0.1, 1.0 - (fid / 500000)); 
  
  const followerCount = Math.floor(rand(1) * 10000 * baseFactor) + 50;
  const followingCount = Math.floor(rand(2) * 2000);
  const castCount = Math.floor(rand(3) * 5000 * baseFactor) + 10;
  
  // Engagement simulation
  const recentLikes = Math.floor(rand(4) * 500);
  const recentReplies = Math.floor(rand(5) * 200);
  
  return {
    fid,
    username: `user_${fid}`,
    displayName: `Farcaster User ${fid}`,
    pfpUrl: `${MOCK_PFP_BASE}/${fid}/200/200`,
    bio: rand(6) > 0.1 ? "Building cool stuff on Farcaster. Explorer of the new internet. 🎩🔮" : "",
    followerCount,
    followingCount,
    castCount,
    recentLikes,
    recentReplies,
    castsPerWeek: Math.floor(rand(7) * 50),
    accountAgeDays: Math.floor(rand(8) * 365 * 2) + 30,
    verified: rand(9) > 0.5,
  };
};

export const getLeaderboard = async (): Promise<Array<{fid: number, username: string, score: number, pfpUrl: string}>> => {
    // Mock leaderboard data
    return Array.from({ length: 10 }).map((_, i) => ({
        fid: 1000 + i,
        username: `legend_${i}`,
        score: 99 - i * 2,
        pfpUrl: `${MOCK_PFP_BASE}/${1000+i}/100/100`
    }));
}
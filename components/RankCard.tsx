import React from 'react';
import { RankScore, UserProfile, Tier } from '../types';
import { getTierColor, getTierBadge } from '../services/scoreService';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface RankCardProps {
  profile: UserProfile;
  rank: RankScore;
  loading?: boolean;
}

export const RankCard: React.FC<RankCardProps> = ({ profile, rank, loading }) => {
  if (loading) {
    return (
      <div className="w-full aspect-[1.91/1] bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center animate-pulse shadow-2xl">
        <div className="h-16 w-16 bg-slate-700 rounded-full mb-4"></div>
        <div className="h-6 w-32 bg-slate-700 rounded mb-2"></div>
        <div className="h-4 w-24 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const tierColor = getTierColor(rank.tier);
  const badgeName = getTierBadge(rank.tier);

  return (
    <div className="relative w-full aspect-[1.91/1] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col group select-none">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-neon-purple opacity-20 blur-[80px] rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-neon-cyan opacity-20 blur-[80px] rounded-full"></div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img 
            src={profile.pfpUrl} 
            alt={profile.username} 
            className={`w-20 h-20 rounded-full border-4 ${rank.tier === Tier.S ? 'border-yellow-400' : 'border-slate-700'} object-cover shadow-lg`}
          />
          <div>
            <h2 className="text-2xl font-bold text-white truncate max-w-[200px]">{profile.displayName}</h2>
            <p className="text-slate-400 font-mono text-sm">@{profile.username}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">FID: {profile.fid}</span>
            </div>
          </div>
        </div>

        {/* Rank Score Display */}
        <div className="text-right">
          <div className={`text-6xl font-black ${tierColor} leading-none tracking-tighter`}>
            {rank.totalScore}
          </div>
          <div className="text-sm font-bold tracking-widest text-slate-500 uppercase mt-1">
             Rank Score
          </div>
        </div>
      </div>

      {/* Badge & Stats */}
      <div className="relative z-10 px-6 mt-6 grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
             <span className={`text-2xl font-black ${tierColor}`}>{rank.tier}</span>
             <span className="text-lg font-bold text-white uppercase tracking-wide">{badgeName}</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
             <div>
                <p className="text-slate-500 text-xs uppercase">Followers</p>
                <p className="text-white font-mono font-bold">{profile.followerCount.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-slate-500 text-xs uppercase">Avg Likes</p>
                <p className="text-white font-mono font-bold">{(profile.recentLikes / 30).toFixed(1)}</p>
             </div>
             <div>
                <p className="text-slate-500 text-xs uppercase">Casts</p>
                <p className="text-white font-mono font-bold">{profile.castCount.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-slate-500 text-xs uppercase">Frequency</p>
                <p className="text-white font-mono font-bold">{profile.castsPerWeek}/wk</p>
             </div>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="flex flex-col justify-end">
           <p className="text-slate-500 text-xs uppercase mb-1 text-right">7-Day Activity Trend</p>
           <div className="h-20 w-full bg-slate-800/50 rounded-lg border border-slate-700/50 p-2 overflow-hidden relative">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={rank.history}>
                 <Line 
                   type="monotone" 
                   dataKey="value" 
                   stroke={rank.tier === Tier.S ? '#facc15' : '#b983ff'} 
                   strokeWidth={3} 
                   dot={false} 
                   isAnimationActive={true}
                 />
                 <YAxis domain={[0, 100]} hide />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-3 left-6 text-[10px] text-slate-600 font-mono">
        Farcaster Rank Ultimate • frame.ranker.xyz
      </div>
    </div>
  );
};

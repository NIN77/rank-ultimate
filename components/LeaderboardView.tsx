import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/farcasterService';
import { Tier } from '../types';
import { getTierColor } from '../services/scoreService';

export const LeaderboardView = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getLeaderboard().then(setUsers);
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-yellow-400">👑</span> Global Hall of Fame
      </h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
         <table className="w-full text-left">
           <thead>
             <tr className="bg-slate-800/50 border-b border-slate-700">
               <th className="p-4 text-slate-400 font-medium text-sm uppercase">Rank</th>
               <th className="p-4 text-slate-400 font-medium text-sm uppercase">User</th>
               <th className="p-4 text-slate-400 font-medium text-sm uppercase text-right">Score</th>
               <th className="p-4 text-slate-400 font-medium text-sm uppercase text-center">Tier</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-800">
             {users.map((user, idx) => {
               const tier = user.score >= 90 ? Tier.S : user.score >= 75 ? Tier.A : Tier.B;
               const tierColor = getTierColor(tier);
               
               return (
                 <tr key={user.fid} className="hover:bg-slate-800/30 transition-colors">
                   <td className="p-4 text-slate-500 font-mono font-bold">#{idx + 1}</td>
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <img src={user.pfpUrl} alt="" className="w-8 h-8 rounded-full bg-slate-700" />
                       <span className="text-slate-200 font-medium">{user.username}</span>
                     </div>
                   </td>
                   <td className="p-4 text-right">
                     <span className="text-white font-bold">{user.score}</span>
                   </td>
                   <td className="p-4 text-center">
                     <span className={`font-black ${tierColor}`}>{tier}</span>
                   </td>
                 </tr>
               );
             })}
           </tbody>
         </table>
         <div className="p-4 bg-slate-800/30 text-center text-slate-500 text-xs">
           Leaderboard updates weekly. Top 10 shown.
         </div>
      </div>
    </div>
  );
};
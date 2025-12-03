import React, { useState } from 'react';
import { RankCard } from './RankCard';
import { UserProfile, RankScore } from '../types';
import { fetchProfile } from '../services/farcasterService';
import { calculateRank } from '../services/scoreService';
import { compareProfiles } from '../services/geminiService';

export const ComparisonView = () => {
  const [fid1, setFid1] = useState(2); // Vitalik
  const [fid2, setFid2] = useState(3); // dwr.eth
  
  const [data1, setData1] = useState<{p: UserProfile, r: RankScore} | null>(null);
  const [data2, setData2] = useState<{p: UserProfile, r: RankScore} | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    setAiAnalysis("");
    
    try {
      const [p1, p2] = await Promise.all([fetchProfile(fid1), fetchProfile(fid2)]);
      const r1 = calculateRank(p1);
      const r2 = calculateRank(p2);
      
      setData1({p: p1, r: r1});
      setData2({p: p2, r: r2});
      
      compareProfiles(p1, r1, p2, r2).then(setAiAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2">
            <span className="text-slate-400">User A FID:</span>
            <input 
              type="number" 
              value={fid1} 
              onChange={(e) => setFid1(Number(e.target.value))}
              className="bg-slate-900 border border-slate-600 text-white rounded px-3 py-2 w-24 text-center focus:ring-2 focus:ring-neon-cyan outline-none"
            />
        </div>
        <span className="text-slate-500 font-bold">VS</span>
        <div className="flex items-center gap-2">
            <span className="text-slate-400">User B FID:</span>
            <input 
              type="number" 
              value={fid2} 
              onChange={(e) => setFid2(Number(e.target.value))}
              className="bg-slate-900 border border-slate-600 text-white rounded px-3 py-2 w-24 text-center focus:ring-2 focus:ring-neon-purple outline-none"
            />
        </div>
        <button 
          onClick={handleCompare}
          disabled={loading}
          className="bg-gradient-to-r from-neon-cyan to-blue-500 text-black font-bold px-6 py-2 rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {loading ? 'Analyzing...' : 'Fight!'}
        </button>
      </div>

      {/* Results Area */}
      {(data1 && data2) && (
        <div className="space-y-6 animate-fade-in-up">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="transform md:scale-95 hover:scale-100 transition-transform duration-300">
                  <RankCard profile={data1.p} rank={data1.r} />
                  {data1.r.totalScore > data2.r.totalScore && (
                     <div className="mt-4 text-center text-neon-green font-bold text-xl drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        WINNER 🏆
                     </div>
                  )}
              </div>
              <div className="transform md:scale-95 hover:scale-100 transition-transform duration-300">
                  <RankCard profile={data2.p} rank={data2.r} />
                  {data2.r.totalScore > data1.r.totalScore && (
                     <div className="mt-4 text-center text-neon-green font-bold text-xl drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        WINNER 🏆
                     </div>
                  )}
              </div>
           </div>

           {/* AI Insight */}
           <div className="bg-slate-900/80 border border-neon-purple/30 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple"></div>
               <h3 className="text-neon-purple font-mono font-bold mb-2 flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                   AI Analysis
               </h3>
               <p className="text-slate-300 leading-relaxed italic">
                   {aiAnalysis ? `"${aiAnalysis}"` : "Consulting the oracle..."}
               </p>
           </div>
        </div>
      )}
    </div>
  );
};

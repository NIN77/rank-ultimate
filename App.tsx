import React, { useState, useEffect } from 'react';
import { RankCard } from './components/RankCard';
import { ComparisonView } from './components/ComparisonView';
import { LeaderboardView } from './components/LeaderboardView';
import { fetchProfile } from './services/farcasterService';
import { calculateRank, getTierColor } from './services/scoreService';
import { analyzeProfile, ProfileAnalysis } from './services/geminiService';
import { UserProfile, RankScore, ScreenState } from './types';

// Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TrophyIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CompareIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('WELCOME');
  const [inputFid, setInputFid] = useState('3'); // Default to dwr.eth (ID 3)
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rank, setRank] = useState<RankScore | null>(null);
  const [aiData, setAiData] = useState<ProfileAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setScreen('CALCULATING');
    setError('');
    
    try {
      const fid = parseInt(inputFid);
      if (isNaN(fid) || fid <= 0) throw new Error("Invalid FID");

      const p = await fetchProfile(fid);
      const r = calculateRank(p);
      
      setProfile(p);
      setRank(r);
      
      // Don't block UI on AI
      analyzeProfile(p, r).then(setAiData);
      
      setScreen('RESULT');
    } catch (e) {
      setError("Could not fetch profile. Try FID 2 or 3.");
      setScreen('WELCOME');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-neon-purple selection:text-white pb-20">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
             <span className="text-neon-purple">Rank</span>
             <span className="text-white">Ultimate</span>
           </div>
           
           <div className="flex gap-4 text-sm font-medium">
             <button onClick={() => setScreen('WELCOME')} className={`flex items-center gap-2 hover:text-white transition-colors ${screen === 'WELCOME' || screen === 'RESULT' ? 'text-neon-cyan' : 'text-slate-400'}`}>
               <HomeIcon /> <span className="hidden sm:inline">Rank</span>
             </button>
             <button onClick={() => setScreen('COMPARE')} className={`flex items-center gap-2 hover:text-white transition-colors ${screen === 'COMPARE' ? 'text-neon-cyan' : 'text-slate-400'}`}>
               <CompareIcon /> <span className="hidden sm:inline">Compare</span>
             </button>
             <button onClick={() => setScreen('LEADERBOARD')} className={`flex items-center gap-2 hover:text-white transition-colors ${screen === 'LEADERBOARD' ? 'text-neon-cyan' : 'text-slate-400'}`}>
               <TrophyIcon /> <span className="hidden sm:inline">Leaderboard</span>
             </button>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col items-center">
        
        {screen === 'WELCOME' && (
          <div className="w-full max-w-md mt-10 space-y-8 text-center animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                What's your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Farcaster Rank?</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Discover your influence score, tier badge, and get AI-powered growth tips.
              </p>
            </div>

            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl flex gap-2">
              <input
                type="number"
                value={inputFid}
                onChange={(e) => setInputFid(e.target.value)}
                placeholder="Enter FID (e.g. 3)"
                className="bg-slate-900 text-white flex-grow px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-neon-purple transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleCalculate}
                className="bg-neon-purple hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-lg transition-all active:scale-95"
              >
                Rank Me
              </button>
            </div>
            {error && <p className="text-red-400 text-sm bg-red-900/20 py-2 rounded border border-red-900">{error}</p>}
            
            <div className="grid grid-cols-3 gap-4 pt-8 opacity-60">
               <div className="text-center">
                 <div className="text-2xl mb-1">📊</div>
                 <div className="text-xs uppercase font-bold text-slate-500">Analytics</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl mb-1">🤖</div>
                 <div className="text-xs uppercase font-bold text-slate-500">AI Insights</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl mb-1">🏆</div>
                 <div className="text-xs uppercase font-bold text-slate-500">Badges</div>
               </div>
            </div>
          </div>
        )}

        {screen === 'CALCULATING' && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-mono text-neon-cyan animate-pulse">Crunching the numbers...</p>
          </div>
        )}

        {screen === 'RESULT' && profile && rank && (
          <div className="w-full max-w-2xl animate-fade-in-up space-y-6">
            
            {/* The Main Card */}
            <RankCard profile={profile} rank={rank} />

            {/* Action Bar */}
            <div className="flex gap-4 justify-center">
               <button className="flex-1 bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                 Share Frame
               </button>
               <button className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                 Download GIF
               </button>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <span className="bg-gradient-to-r from-neon-purple to-pink-500 text-transparent bg-clip-text">Gemini Analysis</span>
                 <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">AI</span>
               </h3>
               
               {!aiData ? (
                 <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <p className="text-slate-300 italic border-l-4 border-neon-purple pl-4 py-1 bg-slate-800/30 rounded-r">
                      "{aiData.summary}"
                    </p>
                    
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase mb-2 mt-4">Growth Tips</h4>
                      <ul className="space-y-2">
                        {aiData.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-200 bg-slate-800/50 p-3 rounded-lg">
                            <span className="text-neon-cyan font-bold">{i + 1}.</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>
               )}
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {Object.entries(rank.breakdown).map(([key, value]) => (
                 <div key={key} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">
                      {key.replace('Score', '')}
                    </div>
                    <div className={`text-xl font-black ${(value as number) > 80 ? 'text-green-400' : (value as number) > 50 ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {Math.round(value as number)}
                    </div>
                 </div>
               ))}
            </div>

          </div>
        )}

        {screen === 'COMPARE' && <ComparisonView />}
        {screen === 'LEADERBOARD' && <LeaderboardView />}

      </main>

      {/* Dev Note */}
      <footer className="w-full text-center py-6 text-slate-600 text-xs border-t border-slate-900 mt-auto">
        <p>Built with React & Tailwind • Simulates Farcaster Frame environment</p>
      </footer>
    </div>
  );
}
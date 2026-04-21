/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';
import { Activity, Gamepad2, Settings, Zap } from 'lucide-react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="mesh-bg flex flex-col min-h-screen w-screen p-6 gap-6 font-sans">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full transition-all duration-1000" 
            style={{ background: `linear-gradient(to tr, #d946ef, ${currentTrack.color})` }}
          />
          <h1 className="text-3xl font-black tracking-tighter uppercase neon-text-cyan">
            Synth<span className="text-white">Slither</span>
          </h1>
        </div>
        
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Latency</p>
            <p className="text-xl font-mono text-white/90">0.12ms</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Node</p>
            <p className="text-xl font-mono neon-text-fuchsia uppercase">Active</p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 w-full grid grid-cols-12 gap-6 min-h-0">
        {/* Left Side: Playlist */}
        <aside className="col-span-3 flex flex-col gap-4 min-h-0">
           <MusicPlayer 
            currentTrack={currentTrack} 
            onTrackChange={setCurrentTrack}
            isPlaying={isPlaying}
            onPlayPause={setIsPlaying}
            mode="playlist"
          />
          
          <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-32">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Game Pulse</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`w-4 h-1.5 rounded-full transition-all duration-500 ${i <= 3 ? 'shadow-[0_0_8px_currentColor]' : 'bg-zinc-800'}`}
                  style={{ color: i <= 3 ? currentTrack.color : 'transparent', backgroundColor: i <= 3 ? 'currentColor' : '' }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Game */}
        <section className="col-span-6 flex items-center justify-center">
          <div className="glass-panel p-2 rounded-xl shadow-2xl w-full h-full max-h-[600px]">
            <SnakeGame accentColor={currentTrack.color} isMusicPlaying={isPlaying} />
          </div>
        </section>

        {/* Right Side: Metadata / Controls info */}
        <aside className="col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center gap-8 h-full">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tactile Interface</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="w-14 h-14 rounded-xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800 text-zinc-600"></div>
              <div className="w-14 h-14 rounded-xl glass-panel flex items-center justify-center text-xl font-bold neon-text-cyan hover:scale-110 transition-transform">W</div>
              <div className="w-14 h-14 rounded-xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800 text-zinc-600"></div>
              <div className="w-14 h-14 rounded-xl glass-panel flex items-center justify-center text-xl font-bold neon-text-cyan hover:scale-110 transition-transform">A</div>
              <div className="w-14 h-14 rounded-xl glass-panel flex items-center justify-center text-xl font-bold neon-text-cyan hover:scale-110 transition-transform">S</div>
              <div className="w-14 h-14 rounded-xl glass-panel flex items-center justify-center text-xl font-bold neon-text-cyan hover:scale-110 transition-transform">D</div>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="p-3 glass-panel rounded-xl">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Session Data</p>
                <p className="text-xs font-mono text-white/60">ENCRYPTED_SIGNAL_0X1</p>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter underline underline-offset-4 decoration-fuchsia-500/50">Space to Toggle Neural Link</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Player Controls */}
      <footer className="w-full h-24">
        <MusicPlayer 
          currentTrack={currentTrack} 
          onTrackChange={setCurrentTrack}
          isPlaying={isPlaying}
          onPlayPause={setIsPlaying}
          mode="controls"
        />
      </footer>
    </div>
  );
}

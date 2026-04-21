import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, ListMusic } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

interface MusicPlayerProps {
  onTrackChange: (track: Track) => void;
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  mode: 'playlist' | 'controls';
}

export default function MusicPlayer({ 
  onTrackChange, 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  mode 
}: MusicPlayerProps) {
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (mode === 'controls' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, mode]);

  const togglePlay = () => onPlayPause(!isPlaying);

  const handleSkip = (direction: 'next' | 'prev') => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    onTrackChange(TRACKS[nextIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === 'playlist') {
    return (
      <div className="glass-panel flex-1 rounded-2xl p-4 overflow-hidden flex flex-col min-h-0">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 px-2">Neural Playlist</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
          {TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => onTrackChange(track)}
              className={`w-full p-3 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                currentTrack.id === track.id 
                  ? 'bg-white/5 border-cyan-500/30' 
                  : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <p className={`text-sm font-bold transition-colors ${currentTrack.id === track.id ? 'neon-text-cyan' : 'text-zinc-300'}`}>
                {track.title}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                {track.artist}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 flex items-center gap-8 relative overflow-hidden">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={currentTrack.cover} 
            className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-110' : 'scale-100 grayscale-[0.5]'}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex items-end gap-0.5 h-4">
                  <div className="w-1 bg-white animate-[bounce_0.6s_infinite]" />
                  <div className="w-1 bg-white animate-[bounce_0.8s_infinite]" />
                  <div className="w-1 bg-white animate-[bounce_0.5s_infinite]" />
                </div>
             </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate text-white">{currentTrack.title}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Main Controls & Progress */}
      <div className="flex-1 flex flex-col items-center gap-3">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => handleSkip('prev')}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-1" />}
          </button>
          <button 
             onClick={() => handleSkip('next')}
             className="text-zinc-400 hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="w-full flex items-center gap-3 px-10">
          <span className="text-[10px] font-mono text-zinc-600">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full relative z-10"
              style={{ backgroundColor: currentTrack.color, width: `${progress}%`, boxShadow: `0 0 10px ${currentTrack.color}` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-600">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-1/4 flex justify-end items-center gap-4 text-zinc-500">
        <Volume2 size={16} />
        <div className="w-24 h-1 bg-zinc-900 rounded-full group relative cursor-pointer">
          <input 
             type="range" 
             min="0" max="1" step="0.01" 
             value={volume}
             onChange={(e) => setVolume(parseFloat(e.target.value))}
             className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
          />
          <div className="h-full bg-white rounded-full transition-all relative z-10" style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

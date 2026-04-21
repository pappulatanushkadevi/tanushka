import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyberpunk Horizon',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/300/300',
    color: '#00f2ff',
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Digital Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/300/300',
    color: '#ff00ff',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Arcade Pulse',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid/300/300',
    color: '#39ff14',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 100;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Point, Direction } from '../types';
import { Trophy, RefreshCw, Play } from 'lucide-react';

interface SnakeGameProps {
  accentColor: string;
  isMusicPlaying?: boolean;
}

export default function SnakeGame({ accentColor, isMusicPlaying }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collisions
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current >= GAME_SPEED) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [moveSnake]);

  const SNAKE_HEAD_COLOR = '#06b6d4';
  const SNAKE_BODY_COLOR = '#22d3ee';
  const FOOD_COLOR = '#f43f5e';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const cellSize = size / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
      ctx.shadowBlur = index === 0 ? 12 : 8;
      ctx.shadowColor = isHead ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
      
      const padding = isHead ? 0.5 : 1;
      const radius = isHead ? 4 : 2;

      // Draw rounded rect for segment
      ctx.beginPath();
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      const w = cellSize - padding * 2;
      const h = cellSize - padding * 2;
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = FOOD_COLOR;
    ctx.shadowBlur = 15;
    ctx.shadowColor = FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0; // Reset shadow
  }, [snake, food]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Adjust for padding and header space
        const size = Math.min(width, height - 100) - 20;
        canvasRef.current.width = size;
        canvasRef.current.height = size;
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-full p-6">
      <div className="absolute top-4 left-6 flex items-center gap-8 w-full px-6 justify-between z-20">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Current Score</p>
          <p className="text-2xl font-mono neon-text-fuchsia">
            {score.toString().padStart(4, '0')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Apex Signal</p>
          <p className="text-2xl font-mono text-white/50 tracking-tighter">09,401</p>
        </div>
      </div>

      <div className="relative group p-1 glass-panel rounded-lg shadow-2xl">
        <canvas 
          ref={canvasRef} 
          className="snake-canvas rounded-sm relative z-10"
        />

        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-lg"
            >
              {gameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase neon-text-cyan">Neural Breakdown</h2>
                  <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Signal Lost at {score} pts</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-10 py-4 glass-panel rounded-full text-white font-bold hover:scale-105 transition-all group"
                  >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> REBOOT_SYSTEM
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Signal_Paused</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-10 py-4 glass-panel rounded-full text-white font-bold hover:scale-110 transition-all border-cyan-500/30"
                  >
                    <Play size={20} fill="currentColor" /> Resume_Uplink
                  </button>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-4">Static Detected • Neural Link Holding</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-8 items-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></span>
          Tactile Interaction Active
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
          Input Capture Enabled
        </div>
      </div>
    </div>
  );
}

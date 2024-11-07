'use client'

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import TicTacToeThree from "./GameThree";
import TicTacToeTwo from "./GameTwo";
import SimplifiedCaptchaHoneypot from "./GameFour";

export function GameOne() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 100, y: 0 });
  const [patternIndex, setPatternIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStatus, setGameStatus] = useState(null); // null, 'won', or 'lost'
  
  // Game constants
  const RADIUS = 200;
  const CENTER = { x: RADIUS, y: RADIUS };
  const BALL_SIZE = 24;
  const TARGET_SIZE = 28;
  const PATTERN_DURATION = 5;
  const SPEED_MULTIPLIER = 3;
  const SPIRAL_PATTERN_INDEX = 2; // Index of the spiral chaos pattern

  const patterns = [
    // Chaotic butterfly pattern
    (t) => ({
      x: CENTER.x + Math.sin(t * 0.01) * Math.cos(t * 0.005) * (RADIUS * 0.7),
      y: CENTER.y + Math.cos(t * 0.01) * Math.sin(t * 0.005) * (RADIUS * 0.7)
    }),
    
    // Random Lissajous pattern
    (t) => ({
      x: CENTER.x + Math.sin(t * 0.008 + Math.cos(t * 0.002)) * (RADIUS * 0.7),
      y: CENTER.y + Math.cos(t * 0.006 + Math.sin(t * 0.003)) * (RADIUS * 0.7)
    }),
    
    // Spiral chaos pattern - This is the winning pattern!
    (t) => {
      const angle = t * 0.01;
      const wobble = Math.sin(t * 0.005) * 30;
      return {
        x: CENTER.x + (Math.cos(angle) * (RADIUS * 0.5 + wobble)),
        y: CENTER.y + (Math.sin(angle) * (RADIUS * 0.5 + wobble))
      };
    },
    
    // Random zigzag with varying amplitude
    (t) => ({
      x: CENTER.x + Math.cos(t * 0.02) * (RADIUS * 0.7) * Math.sin(t * 0.001),
      y: CENTER.y + Math.sin(t * 0.03) * (RADIUS * 0.7) * Math.cos(t * 0.001)
    }),
    
    // Erratic orbital pattern
    (t) => {
      const baseAngle = t * 0.015;
      const radiusVariation = Math.sin(t * 0.003) * 0.3;
      return {
        x: CENTER.x + Math.cos(baseAngle) * (RADIUS * (0.4 + radiusVariation)),
        y: CENTER.y + Math.sin(baseAngle * 1.5) * (RADIUS * (0.4 + radiusVariation))
      };
    }
  ];

  // Animation loop with increased speed
  useEffect(() => {
    if (!gameStarted || gameStatus) return;

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setTime(prevTime => {
        const newTime = prevTime + (deltaTime * SPEED_MULTIPLIER);
        if (Math.floor(prevTime / (PATTERN_DURATION * 1000)) !== 
            Math.floor(newTime / (PATTERN_DURATION * 1000))) {
          setPatternIndex(prev => (prev + 1) % patterns.length);
        }
        return newTime;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStarted, gameStatus]);

  // Update target position based on current pattern
  useEffect(() => {
    if (!gameStarted || gameStatus) return;
    setTargetPosition(patterns[patternIndex](time));
  }, [time, patternIndex, gameStarted, gameStatus]);

  const handleClick = () => {
    if (!gameStarted || gameStatus) return;
    
    if (patternIndex === SPIRAL_PATTERN_INDEX) {
      setGameStatus('won');
    } else {
      setGameStatus('lost');
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!gameStarted || gameStatus) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setCursorPosition({ x: mouseX, y: mouseY });
  }, [gameStarted, gameStatus]);

  const patternNames = [
    "Chaotic Butterfly",
    "Random Lissajous",
    "✨ Spiral Chaos ✨",
    "Random Zigzag",
    "Erratic Orbit"
  ];

  const resetGame = () => {
    setGameStarted(true);
    setGameStatus(null);
    setTime(0);
    setPatternIndex(0);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="flex flex-col items-center gap-4">
          {!gameStarted ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                Click when you see the "Spiral Chaos" pattern to win! 
                Click during any other pattern and you lose.
              </p>
              <button
                onClick={resetGame}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Start Game
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                {gameStatus ? (
                  <div className={`text-2xl font-bold ${gameStatus === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                    {gameStatus === 'won' ? 'You Won! 🎉' : 'Game Over! 😢'}
                    <button
                      onClick={resetGame}
                      className="block mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                ) : (
                  <>
                  
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Pattern changes in: {PATTERN_DURATION - Math.floor((time / 1000) % PATTERN_DURATION)}s
                    </div>
                  </>
                )}
              </div>
              <div
                className="relative cursor-none"
                style={{ 
                  width: RADIUS * 2, 
                  height: RADIUS * 2,
                }}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => !gameStatus && setGameStarted(false)}
              >
                <div 
                  className={`absolute inset-0 rounded-full transition-colors duration-300
                    ${gameStatus === 'won' ? 'bg-green-100 dark:bg-green-900/20' :
                      gameStatus === 'lost' ? 'bg-red-100 dark:bg-red-900/20' :
                      'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'}`}
                  style={{
                    width: RADIUS * 2,
                    height: RADIUS * 2,
                  }}
                />

                {/* Player's cursor/ball */}
                {!gameStatus && (
                  <div
                    className="absolute bg-blue-500 rounded-full shadow-lg"
                    style={{
                      width: BALL_SIZE,
                      height: BALL_SIZE,
                      left: cursorPosition.x - BALL_SIZE / 2,
                      top: cursorPosition.y - BALL_SIZE / 2,
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
                      transition: 'none'
                    }}
                  />
                )}
                
                {/* Target */}
                {!gameStatus && (
                  <div
                    className={`absolute rounded-full shadow-lg
                      ${patternIndex === SPIRAL_PATTERN_INDEX ? 
                        'bg-yellow-400 animate-pulse' : 'bg-red-400'}`}
                    style={{
                      width: TARGET_SIZE,
                      height: TARGET_SIZE,
                      left: targetPosition.x - TARGET_SIZE / 2,
                      top: targetPosition.y - TARGET_SIZE / 2,
                      boxShadow: patternIndex === SPIRAL_PATTERN_INDEX ?
                        '0 0 20px rgba(250, 204, 21, 0.7)' :
                        '0 0 15px rgba(239, 68, 68, 0.5)',
                      transition: 'none'
                    }}
                  />
                )}
              </div>
              {!gameStatus && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click when you see the Spiral Chaos pattern!
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          {/* Footer content remains the same */}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const selectComponent = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Chinatown Mafia Verifier</h1>
      <div className="flex justify-center items-center w-full">
        {selectedComponent}
      </div>
      <div className="flex gap-4">
        <button onClick={() => selectComponent(<GameOne />)} className="btn">
          Game One
        </button>
        <button onClick={() => selectComponent(<TicTacToeTwo />)} className="btn">
          Tic Tac Toe Two
        </button>
        <button onClick={() => selectComponent(<TicTacToeThree />)} className="btn">
          Tic Tac Toe Three
        </button>
        <button onClick={() => selectComponent(<SimplifiedCaptchaHoneypot />)} className="btn">
          Simplified Captcha Honeypot
        </button>
      </div>
    </div>
  );
}
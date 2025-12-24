import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
  type: 'circle' | 'square' | 'star';
}

const COLORS = [
  'hsl(170, 80%, 45%)', // Primary
  'hsl(280, 60%, 55%)', // Secondary
  'hsl(45, 100%, 60%)', // Accent
  'hsl(140, 70%, 45%)', // Success
  'hsl(0, 70%, 55%)',   // Destructive
  'hsl(200, 80%, 50%)', // Blue
  'hsl(320, 70%, 55%)', // Pink
];

const SHAPES: Particle['type'][] = ['circle', 'square', 'star'];

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = [];
      // More particles for celebration
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20, // Start above screen
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 1.5,
          size: 6 + Math.random() * 10,
          rotation: Math.random() * 360,
          type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        });
      }
      setParticles(newParticles);

      // Longer celebration
      const timer = setTimeout(() => {
        setParticles([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.type !== 'star' ? particle.color : 'transparent',
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: particle.type === 'circle' ? '50%' : particle.type === 'square' ? '2px' : '0',
            clipPath: particle.type === 'star' 
              ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              : 'none',
            background: particle.type === 'star' ? particle.color : undefined,
          }}
        />
      ))}
    </div>
  );
}

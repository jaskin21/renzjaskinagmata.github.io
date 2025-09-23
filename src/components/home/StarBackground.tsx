import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  // Generate stars
  useEffect(() => {
    const generated: Star[] = Array.from({ length: 1500 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setStars(generated);
  }, []);

  // Respawn a star at random location
  const respawnStar = (id: number) => {
    setStars((prev) =>
      prev.map((star) =>
        star.id === id
          ? {
              ...star,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }
          : star
      )
    );
  };

  return (
    <div className='fixed inset-0 bg-black overflow-hidden -z-10'>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className='absolute w-[3px] h-[3px] bg-white rounded-full'
          style={{ left: star.x, top: star.y }}
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: Math.random() * 4 + 2, // 2–6 sec
            repeat: Infinity,
            repeatDelay: Math.random() * 3, // add random delay
            onRepeat: () => respawnStar(star.id), // respawn when cycle ends
          }}
        />
      ))}
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({ variant = 'gradient', intensity = 'medium' }) => {
  const variants = {
    gradient: {
      colors: ['#2E7D32', '#43A047', '#66BB6A', '#A5D6A7'],
    },
    ocean: {
      colors: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
    },
    sunset: {
      colors: ['#f72585', '#b5179e', '#7209b7', '#480ca8'],
    },
    forest: {
      colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
    },
  };

  const intensityMap = {
    low: 'opacity-20',
    medium: 'opacity-30',
    high: 'opacity-40',
  };

  const selectedVariant = variants[variant] || variants.gradient;
  const opacityClass = intensityMap[intensity] || intensityMap.medium;

  return (
    <div className={`fixed inset-0 pointer-events-none ${opacityClass}`}>
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%]"
      >
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${selectedVariant.colors[0]}40 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%]"
      >
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${selectedVariant.colors[1]}40 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [-50, 50, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-[20%] right-[20%] w-[30%] h-[30%]"
      >
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${selectedVariant.colors[2]}40 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [-50, 0, 50, -50],
          y: [50, -50, 50, -50],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[30%] left-[15%] w-[35%] h-[35%]"
      >
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${selectedVariant.colors[3]}40 0%, transparent 70%)`,
          }}
        />
      </motion.div>
    </div>
  );
};

export default AnimatedBackground;

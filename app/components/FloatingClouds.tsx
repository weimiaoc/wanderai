"use client";

import { motion } from "framer-motion";

export default function FloatingClouds() {
  const clouds = [
    { top: "8%", left: "10%", width: "200px", delay: 0, duration: 25, opacity: 0.6 },
    { top: "15%", left: "60%", width: "160px", delay: 3, duration: 30, opacity: 0.5 },
    { top: "25%", left: "30%", width: "240px", delay: 1, duration: 28, opacity: 0.4 },
    { top: "12%", left: "80%", width: "180px", delay: 5, duration: 22, opacity: 0.55 },
    { top: "5%", left: "45%", width: "120px", delay: 2, duration: 35, opacity: 0.45 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: cloud.width,
            opacity: cloud.opacity,
          }}
          animate={{
            x: [0, 60, -40, 20, 0],
            y: [0, -15, 10, -5, 0],
          }}
          transition={{
            x: {
              duration: cloud.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: cloud.delay,
            },
            y: {
              duration: cloud.duration * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: cloud.delay,
            },
          }}
        >
          <div
            className="rounded-full bg-white/30 dark:bg-white/5 backdrop-blur-sm"
            style={{
              width: "100%",
              height: cloud.width === "240px" ? "80px" : "60px",
              filter: "blur(8px)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

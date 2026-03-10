"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveButtonProps extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragEnd" | "onDragStart" | "onAnimationStart"> {
  children: React.ReactNode;
  className?: string; // Explicitly adding className as string to avoid type clashes
  containerClassName?: string;
  magneticStrength?: number;
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ children, className, containerClassName, magneticStrength = 0.5, ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const combinedRef = (ref as React.MutableRefObject<HTMLButtonElement>) || internalRef;
    
    const [isHovered, setIsHovered] = useState(false);

    // Magnetic logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!combinedRef.current) return;
      const { left, top, width, height } = combinedRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      x.set(distanceX * magneticStrength);
      y.set(distanceY * magneticStrength);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setIsHovered(false);
    };

    return (
      <div
        className={cn("relative group", containerClassName)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
      >
        <motion.button
          ref={combinedRef}
          style={{ x: springX, y: springY }}
          className={cn(
            "relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/20",
            className
          )}
          {...(props as any)}
        >
          {/* Shimmer Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />
          
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        </motion.button>

        {/* Outer Glow Shadow */}
        <motion.div
          animate={isHovered ? { opacity: 0.4, scale: 1.1 } : { opacity: 0, scale: 1 }}
          className="absolute inset-0 -z-10 rounded-2xl bg-blue-500/30 blur-2xl pointer-events-none"
        />
      </div>
    );
  }
);

InteractiveButton.displayName = "InteractiveButton";

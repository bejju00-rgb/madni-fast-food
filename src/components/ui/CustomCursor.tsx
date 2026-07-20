"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  const particleId = useRef(0);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    setIsVisible(true);
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (Math.random() > 0.92) {
        const id = particleId.current++;
        const particle = { x: e.clientX, y: e.clientY, id };
        setParticles((prev) => [...prev.slice(-15), particle]);
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 1000);
      }
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX - 8}px, ${cursorY - 8}px)`;
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
      }
      requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll(
      "a, button, [data-cursor='pointer'], input, textarea, select"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    window.addEventListener("mousemove", handleMouseMove);
    const animFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-orange rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          transition: "width 0.3s, height 0.3s",
          width: isHovering ? 16 : 8,
          height: isHovering ? 16 : 8,
        }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-orange/50 rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          borderColor: isHovering ? "rgba(255, 107, 0, 0.8)" : "rgba(255, 107, 0, 0.3)",
        }}
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed w-1.5 h-1.5 bg-yellow rounded-full pointer-events-none z-[9997] hidden md:block"
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
        />
      ))}
    </>
  );
}

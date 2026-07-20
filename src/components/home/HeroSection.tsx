"use client";

import { useEffect, useRef, useState } from "react";
import NavLink from "@/components/ui/NavLink";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const videos = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4"];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5,
      });

      gsap.from(".hero-sub", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 1.5,
        ease: "power3.out",
      });

      gsap.to(videoRef.current, {
        scale: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        {videos.map((src, i) => (
          <video
            key={src}
            ref={i === currentVideo ? videoRef : undefined}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === currentVideo ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div ref={headingRef} className="mb-6">
          <h1 className="overflow-hidden">
            <span className="hero-line block text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black">
              <span className="gradient-text">Madni Shawarma</span>
            </span>
            <span className="hero-line block text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black text-white">
              Burgur & Pizza
            </span>
          </h1>
        </div>

        <p className="hero-sub text-lg sm:text-xl lg:text-2xl text-white/70 max-w-2xl mb-10 font-light">
          Delicious Food Delivered To Your Door
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <NavLink href="/menu" className="hero-cta">
            <MagneticButton className="btn-primary text-lg px-10 py-4">
              Order Now
            </MagneticButton>
          </NavLink>
          <NavLink href="/menu" className="hero-cta">
            <MagneticButton className="btn-secondary text-lg px-10 py-4">
              View Menu
            </MagneticButton>
          </NavLink>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-orange rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

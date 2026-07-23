"use client";

import { useEffect, useRef, useState } from "react";
import NavLink from "@/components/ui/NavLink";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const videos = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4"];

const HERO_POSTER =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1920&q=80";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoReady(false);
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoReady(false);
    video.load();

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    return () => video.removeEventListener("loadeddata", tryPlay);
  }, [currentVideo]);

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
        <div
          className={`absolute inset-0 bg-cover bg-center scale-105 transition-opacity duration-700 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
          aria-hidden
        />
        <video
          key={videos[currentVideo]}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          onCanPlay={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videos[currentVideo]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <p
          className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md
                     text-sm sm:text-base md:text-lg font-semibold tracking-wide text-white
                     bg-dark/50 backdrop-blur-md border border-orange/40 rounded-full
                     px-4 py-2.5 sm:px-6 sm:py-3 shadow-lg shadow-black/30"
        >
          Open from 6 PM to 2 AM
        </p>

        <div ref={headingRef} className="mb-6">
          <h1 className="overflow-hidden">
            <span className="hero-line block text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black text-orange">
              Madni Shawarma
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

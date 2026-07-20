"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: "500+", label: "Happy Customers" },
  { number: "50+", label: "Menu Items" },
  { number: "8", label: "Special Deals" },
  { number: "30min", label: "Avg Delivery" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = sectionRef.current?.querySelectorAll(".split-char");
      if (chars) {
        gsap.from(chars, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.03,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      }

      gsap.from(".about-stat", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="split-char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section ref={sectionRef} id="about" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-orange font-semibold text-sm uppercase tracking-widest">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-montserrat font-black mt-2 mb-6 overflow-hidden">
              {splitText("Taste the Madni Difference")}
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              At Madni Shawarma Burgur & Pizza, we serve premium quality shawarma, burgers, pizza and more.
              Every dish is prepared fresh with the finest ingredients. From our signature
              Zinger Shawarma to our loaded family deals, we bring you the best fast food
              experience in town.
            </p>
            <p className="text-white/60 leading-relaxed">
              With fast delivery, multiple payment options including JazzCash, Easypaisa and
              Cash on Delivery, ordering from Madni Shawarma Burgur & Pizza is quick and convenient.
            </p>
          </div>

          <div className="about-stats grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="about-stat glass rounded-2xl p-6 text-center hover:border-orange/30 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-montserrat font-black text-orange mb-2">
                  {stat.number}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Card from "./Card";
import TwisterSection from "./TwisterSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollCards() {
  const containerRef = useRef();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".card-content");

      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card.parentElement, // Trigger based on the sticky wrapper
            start: "top center+=200", // Start animation when card is near center
            end: "top top", // End when it hits the top (sticks)
            scrub: 1,
            toggleActions: "play none none reverse",
          },
          // "Lift from Left" Animation
          rotationZ: -10, // Tilted left down
          y: 200, // Coming from below
          x: -100, // Slight left offset
          // opacity: 0, // Removed fade-in
          scale: 0.8,
          transformOrigin: "left center", // Lift pivots from left
          ease: "power2.out",
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 
        CSS Sticky Stacking Effect:
        Each card is 100vh tall and sticky at top:0.
        The wrapper does the STICKY.
        The inner div (.card-content) does the ANIMATION.
      */}

      <div className="card-wrapper w-full h-screen sticky top-0 z-10 overflow-hidden">
        <div className="card-content w-full h-full bg-slate-900 border-t border-white/10">
          <Card
            title="Easy Booking"
            description="Skip the lines and book your favorite movies in just a few clicks. Our seamless interface makes securing the best seats effortless."
          />
        </div>
      </div>

      <div className="card-wrapper w-full h-screen sticky top-0 z-20 overflow-hidden">
        <div className="card-content w-full h-full bg-slate-800 border-t border-white/10">
          <Card
            title="Best Prices"
            description="Enjoy exclusive deals and discounts on your tickets. We ensure you get the most value for your cinematic experience."
          />
        </div>
      </div>

      <div className="card-wrapper w-full h-screen sticky top-0 z-30 overflow-hidden">
        <div className="card-content w-full h-full bg-slate-700 border-t border-white/10">
          <Card
            title="Best Experience"
            description="Immerse yourself in world-class audio and visuals. We partner with top-tier theaters to guarantee an unforgettable movie night."
          />
        </div>
      </div>

      {/* 
         Twister Section acts as the final "card" 
         It scrolls up, covers the previous ones.
      */}
      <div className="relative z-40 bg-[#d69f9f]">
        <TwisterSection />
      </div>
    </div>
  );
}

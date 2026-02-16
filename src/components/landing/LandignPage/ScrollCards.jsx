import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Card from "./Card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollCards() {
  const containerRef = useRef();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".card-wrapper");

      // Initial positioning
      gsap.set(cards, {
        yPercent: 100,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      });

      // First card starts in view
      gsap.set(cards[0], { yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${cards.length * 200}%`, // Slower scroll
          scrub: 1.5,
          pin: true,
          pinSpacing: true, // Change to true first to test visibility
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) {
          tl.to({}, { duration: 1 }); // Stay on first card for a bit
          return;
        }

        tl.to(card, {
          yPercent: 0,
          ease: "none",
          duration: 2,
        })
          .to(
            cards[i - 1],
            {
              scale: 0.9,
              opacity: 0.5,
              duration: 2,
            },
            "<",
          )
          .to({}, { duration: 1 }); // "Hold" current card before next one
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Wrapping each Card in a div with a background 
         ensures you can see the 'stacking' 
      */}
      <div className="card-wrapper w-full h-screen bg-slate-900 border-t border-white/10">
        <Card title="Explore" />
      </div>
      <div className="card-wrapper w-full h-screen bg-slate-800 border-t border-white/10">
        <Card title="Discover" />
      </div>
      <div className="card-wrapper w-full h-screen bg-slate-700 border-t border-white/10">
        <Card title="Experience" />
      </div>
    </div>
  );
}

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "./Card"
gsap.registerPlugin(ScrollTrigger);



export default function ScrollCards() {
  useEffect(() => {
    // Kill any existing ScrollTriggers to prevent duplicates on hot reload
    ScrollTrigger.getAll().forEach(t => t.kill());

    gsap.fromTo(
      ".card",
      {
        scale: 0.8,
        opacity: 0,
        y: 100,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: ".cards-container",
          start: "top 80%", // Starts animation when container hits 80% of viewport
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          // scrub: 1, // Optional: uncomment if you want the animation tied to scroll position
        },
      },
    );
  }, []);

  return (
    <div className="cards-container relative z-10 w-full mx-auto pt-[100vh] pb-20 overflow-hidden">
      <Card title="Card One" />
      {/* You can add more cards here */}
    </div>
  );
}

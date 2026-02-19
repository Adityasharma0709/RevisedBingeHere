import Card from "./Card";
import TwisterSection from "./TwisterSection";

export default function ScrollCards() {
  return (
    <div className="relative w-full">
      {/* 
        CSS Sticky Stacking Effect:
        Each card is 100vh tall and sticky at top:0.
        As you scroll, the next card (which is in the flow below)
        scrolls up and covers the previous stuck card.
      */}

      <div className="card-wrapper w-full h-screen sticky top-0 bg-slate-900 border-t border-white/10 z-10">
        <Card
          title="Easy Booking"
          description="Skip the lines and book your favorite movies in just a few clicks. Our seamless interface makes securing the best seats effortless."
        />
      </div>

      <div className="card-wrapper w-full h-screen sticky top-0 bg-slate-800 border-t border-white/10 z-20">
        <Card
          title="Best Prices"
          description="Enjoy exclusive deals and discounts on your tickets. We ensure you get the most value for your cinematic experience."
        />
      </div>

      <div className="card-wrapper w-full h-screen sticky top-0 bg-slate-700 border-t border-white/10 z-30">
        <Card
          title="Best Experience"
          description="Immerse yourself in world-class audio and visuals. We partner with top-tier theaters to guarantee an unforgettable movie night."
        />
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

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TwisterSection() {
    const containerRef = useRef();
    const card1Ref = useRef();
    const card2Ref = useRef();

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%", // Scroll distance
                    scrub: 1,
                    pin: true,
                    perspective: 1000, // Important for 3D effect
                },
            });

            // Initial State: Slightly twisted
            gsap.set(card1Ref.current, { rotationY: -15, rotationX: 5 });
            gsap.set(card2Ref.current, { rotationY: 15, rotationX: 5 });

            // Card 1 Animation - Twists MORE and moves up
            tl.to(
                card1Ref.current,
                {
                    yPercent: -150,
                    rotationY: -45,
                    rotationX: 20,
                    rotation: -10,
                    scale: 0.9,
                    ease: "none",
                },
                0
            );

            // Card 2 Animation - Twists MORE opposite way and moves up
            tl.to(
                card2Ref.current,
                {
                    yPercent: -150,
                    rotationY: 45,
                    rotationX: 20,
                    rotation: 10,
                    scale: 0.9,
                    ease: "none",
                },
                0 // Start at same time
            );
        },
        { scope: containerRef }
    );

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-[#d69f9f] flex items-center justify-center"
        >
            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden">
                <h1 className="text-[15vw] md:text-[20vw] font-black text-black leading-none tracking-tighter opacity-90 text-center">
                    BINGE<br />HERE
                </h1>
            </div>

            {/* Cards Container */}
            <div className="relative z-10 w-full max-w-5xl h-full flex items-center justify-center perspective-1000">

                {/* Card 1 (Left) */}
                <div
                    ref={card1Ref}
                    className="absolute left-[15%] md:left-[25%] top-[50%] w-[200px] md:w-[300px] aspect-[2/3] bg-white p-2 shadow-2xl origin-bottom-left"
                    style={{ transform: "translateY(50%)" }}
                >
                    <div className="w-full h-full bg-black overflow-hidden relative">
                        <img
                            src="Avengers.jpg"
                            alt="Poster 1"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Card 2 (Right) */}
                <div
                    ref={card2Ref}
                    className="absolute right-[15%] md:right-[25%] top-[60%] w-[200px] md:w-[300px] aspect-[2/3] bg-white p-2 shadow-2xl origin-bottom-right"
                >
                    <div className="w-full h-full bg-black overflow-hidden relative">
                        <img
                            src="Avataar.jpg"
                            alt="Poster 2"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function JoinCard() {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/auth")}
            className="fixed bottom-10 right-10 z-[100] cursor-pointer group hover:scale-105 transition-transform duration-300"
        >
            {/* Ticket Container */}
            <div
                className="relative bg-red-600 text-white px-8 py-3 shadow-2xl flex items-center gap-4 overflow-hidden"
                style={{
                    // Creates the ticket shape with notches on the left and right
                    maskImage: `radial-gradient(circle at 0 50%, transparent 10px, black 11px), 
                                radial-gradient(circle at 100% 50%, transparent 10px, black 11px)`,
                    maskComposite: 'intersect',
                    WebkitMaskImage: `radial-gradient(circle at 0 50%, transparent 10px, black 11px), 
                                      radial-gradient(circle at 100% 50%, transparent 10px, black 11px)`,
                    WebkitMaskComposite: 'source-in'
                }}
            >
                {/* Dashed Line Separator */}
                <div className="absolute left-[70%] top-2 bottom-2 border-l-2 border-dashed border-white/30" />

                {/* Left Side Content */}
                <div className="flex flex-col items-start pr-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Admit One</span>
                    <span className="text-2xl font-black tracking-tighter uppercase">Join Now</span>
                </div>

                {/* Right Side / Stub */}
                <div className="pl-2 group-hover:translate-x-1 transition-transform">
                    <div className="bg-white/20 p-2 rounded-full">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}

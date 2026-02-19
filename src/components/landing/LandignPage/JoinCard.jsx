import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function JoinCard() {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/auth")}
            className="fixed bottom-10 right-10 z-[100] bg-red-600 text-white px-8 py-4 rounded-full shadow-2xl cursor-pointer hover:bg-red-700 hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
        >
            <span className="text-lg font-bold tracking-wide">Join</span>
            <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
            </div>
        </div>
    );
}

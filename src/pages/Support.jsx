import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mt-4 flex items-center gap-3">
          <HelpCircle className="text-slate-200" size={28} />
          <div>
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p className="text-sm text-slate-400">
              FAQs and support options will appear here.
            </p>
          </div>
        </div>

        <div className="mt-8 border border-white/10 bg-white/5 rounded-xl p-4 text-sm text-slate-300">
          For now, contact support via email or add a chat/help widget here.
        </div>
      </div>
    </div>
  );
}


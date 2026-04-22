import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Clapperboard,
  LogOut,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Loader from "../components/Common/Loader.jsx";
import { getTheatres } from "../services/theatre.services";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => parseStoredUser());
  const [theatres, setTheatres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const loadTheatres = async () => {
    try {
      setIsLoading(true);
      const theatreData = await getTheatres();
      setTheatres(Array.isArray(theatreData) ? theatreData : []);
      setStatus({ type: "idle", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to load theatres right now.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "BingeHere | Admin";
    loadTheatres();
  }, []);

  const stats = useMemo(() => {
    const cities = new Set();
    let ownersAssigned = 0;

    theatres.forEach((theatre) => {
      const city = theatre?.location?.city?.trim();
      if (city) cities.add(city.toLowerCase());
      if (theatre?.owner) ownersAssigned += 1;
    });

    return [
      {
        label: "Active Theatres",
        value: theatres.length,
        helper: "Live from GET /api/theatres",
      },
      {
        label: "Cities Covered",
        value: cities.size,
        helper: "Based on theatre locations",
      },
      {
        label: "Owners Assigned",
        value: ownersAssigned,
        helper: "Theatres linked to an owner",
      },
    ];
  }, [theatres]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const getOwnerLabel = (theatre) => {
    if (typeof theatre.owner === "string") {
      return theatre.owner;
    }

    return (
      theatre.owner?.name ||
      theatre.owner?.email ||
      theatre.owner?._id ||
      "Not assigned"
    );
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <Loader isLoading={isLoading} />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.25),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(250,204,21,0.18),_transparent_35%)]" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100">
                <ShieldCheck size={14} />
                Admin Control Room
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
                  BingeHere Operations
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Manage theatres and keep the registry healthy.
                </h1>
              </div>

              {currentUser?._id ? (
                <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                  Signed in as{" "}
                  <span className="font-semibold text-amber-100">
                    {currentUser?.name || "Admin"}
                  </span>
                  .
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/landing2")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                Back to App
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/create-theatre")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
              >
                <Plus size={16} />
                Create Theatre
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-[24px] border border-white/10 bg-[#0d1a2d] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-black text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.helper}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 space-y-6">
          <article className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(127,29,29,0.68)_55%,_rgba(146,64,14,0.68))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100">
                  <Sparkles size={14} />
                  Tip
                </div>
                <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                  Keep the dashboard clean.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
                  Use the dedicated Create Theatre page to onboard new venues, then
                  come back here to verify the registry.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <Building2 className="text-amber-200" size={20} />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Theatre ready
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Register a new venue in one submission.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <Clapperboard className="text-rose-200" size={20} />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Owner linked
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Keep each theatre assigned to an owner.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-[#0d1728] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Theatre Registry
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Current theatres
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/create-theatre")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
                >
                  <Plus size={16} />
                  Create Theatre
                </button>
                <button
                  type="button"
                  onClick={loadTheatres}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                >
                  <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>

            {status.type === "error" && status.message ? (
              <div className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {status.message}
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              {isLoading ? null : theatres.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-slate-400">
                  <p>No theatres yet.</p>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/create-theatre")}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
                  >
                    <Plus size={16} />
                    Create Theatre
                  </button>
                </div>
              ) : (
                theatres.map((theatre) => (
                  <article
                    key={theatre._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clapperboard size={18} className="text-amber-200" />
                          <h3 className="text-lg font-semibold text-white">
                            {theatre.name}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          {[
                            theatre?.location?.address,
                            theatre?.location?.city,
                            theatre?.location?.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                          Owner: {getOwnerLabel(theatre)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                          Screens: {theatre.screens?.length || 0}
                        </span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;


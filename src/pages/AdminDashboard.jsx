import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Clapperboard,
  KeyRound,
  LogOut,
  Mail,
  MapPinned,
  Phone,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { registerUser } from "../services/auth.services";
import {
  createScreen,
  createTheatre,
  getTheatres,
} from "../services/theatre.services";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const createSeatRow = (index = 0) => ({
  row: String.fromCharCode(65 + index),
  seats: "10",
});

const createScreenDraft = (index = 0) => ({
  name: `Screen ${index + 1}`,
  seatLayout: [createSeatRow(0)],
});

const buildInitialForm = () => ({
  name: "",
  city: "",
  state: "",
  address: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerPassword: "",
  screens: [createScreenDraft(0)],
});

const getTotalSeats = (seatLayout = []) =>
  seatLayout.reduce((total, item) => total + (Number(item.seats) || 0), 0);

const normalizeSeatLayout = (seatLayout = []) =>
  seatLayout
    .map((item) => ({
      row: item.row.trim().toUpperCase(),
      seats: Number(item.seats),
    }))
    .filter((item) => item.row && item.seats > 0);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => parseStoredUser());
  const [formData, setFormData] = useState(() => buildInitialForm());
  const [theatres, setTheatres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    theatres.forEach((theatre) => {
      const city = theatre?.location?.city?.trim();
      if (city) {
        cities.add(city.toLowerCase());
      }
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
        label: "Planned Screens",
        value: formData.screens.length,
        helper: "Configured before theatre launch",
      },
    ];
  }, [formData.screens.length, theatres]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleScreenChange = (screenIndex, field, value) => {
    setFormData((previous) => ({
      ...previous,
      screens: previous.screens.map((screen, index) =>
        index === screenIndex ? { ...screen, [field]: value } : screen,
      ),
    }));
  };

  const handleSeatRowChange = (screenIndex, rowIndex, field, value) => {
    setFormData((previous) => ({
      ...previous,
      screens: previous.screens.map((screen, index) => {
        if (index !== screenIndex) {
          return screen;
        }

        return {
          ...screen,
          seatLayout: screen.seatLayout.map((seatRow, seatRowIndex) =>
            seatRowIndex === rowIndex
              ? { ...seatRow, [field]: value }
              : seatRow,
          ),
        };
      }),
    }));
  };

  const addScreen = () => {
    setFormData((previous) => ({
      ...previous,
      screens: [...previous.screens, createScreenDraft(previous.screens.length)],
    }));
  };

  const removeScreen = (screenIndex) => {
    setFormData((previous) => ({
      ...previous,
      screens:
        previous.screens.length === 1
          ? previous.screens
          : previous.screens.filter((_, index) => index !== screenIndex),
    }));
  };

  const addSeatRow = (screenIndex) => {
    setFormData((previous) => ({
      ...previous,
      screens: previous.screens.map((screen, index) => {
        if (index !== screenIndex) {
          return screen;
        }

        return {
          ...screen,
          seatLayout: [...screen.seatLayout, createSeatRow(screen.seatLayout.length)],
        };
      }),
    }));
  };

  const removeSeatRow = (screenIndex, rowIndex) => {
    setFormData((previous) => ({
      ...previous,
      screens: previous.screens.map((screen, index) => {
        if (index !== screenIndex) {
          return screen;
        }

        return {
          ...screen,
          seatLayout:
            screen.seatLayout.length === 1
              ? screen.seatLayout
              : screen.seatLayout.filter((_, index) => index !== rowIndex),
        };
      }),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?._id) {
      setStatus({
        type: "error",
        message: "Your user session is missing. Please log in again.",
      });
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.address.trim() ||
      !formData.ownerName.trim() ||
      !formData.ownerEmail.trim() ||
      !formData.ownerPhone.trim() ||
      !formData.ownerPassword.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please complete both the theatre and owner details.",
      });
      return;
    }

    const normalizedScreens = formData.screens.map((screen) => ({
      name: screen.name.trim(),
      seatLayout: normalizeSeatLayout(screen.seatLayout),
    }));

    const invalidScreen = normalizedScreens.find(
      (screen) => !screen.name || screen.seatLayout.length === 0,
    );

    if (invalidScreen) {
      setStatus({
        type: "error",
        message: "Each screen needs a name and at least one valid seat row.",
      });
      return;
    }

    let createdOwnerEmail = "";
    let createdTheatreName = "";
    let createdScreenCount = 0;

    try {
      setIsSubmitting(true);

      const ownerPayload = {
        name: formData.ownerName.trim(),
        email: formData.ownerEmail.trim(),
        phone: formData.ownerPhone.trim(),
        password: formData.ownerPassword,
        role: "owner",
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
        },
      };

      createdOwnerEmail = ownerPayload.email;

      const ownerResponse = await registerUser(ownerPayload);
      const ownerId =
        ownerResponse?.user?._id ??
        ownerResponse?.user?.id ??
        ownerResponse?.userId;

      if (!ownerId) {
        throw new Error("Owner was created but no owner id was returned.");
      }

      const theatrePayload = {
        name: formData.name.trim(),
        owner: ownerId,
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          address: formData.address.trim(),
        },
      };

      const createdTheatre = await createTheatre({
        theatreData: theatrePayload,
        userId: currentUser._id,
      });

      createdTheatreName = createdTheatre.name;

      for (const screen of normalizedScreens) {
        await createScreen({
          screenData: {
            name: screen.name,
            theatre: createdTheatre._id,
            totalSeats: getTotalSeats(screen.seatLayout),
            seatLayout: screen.seatLayout,
          },
          userId: currentUser._id,
        });
        createdScreenCount += 1;
      }

      const theatreData = await getTheatres();
      setTheatres(Array.isArray(theatreData) ? theatreData : []);
      setFormData(buildInitialForm());
      setStatus({
        type: "success",
        message: `"${createdTheatre.name}" was created with ${createdScreenCount} screen${createdScreenCount === 1 ? "" : "s"} and owner ${createdOwnerEmail}.`,
      });
    } catch (error) {
      const errorMessage = error.message || "Theatre creation failed.";

      setStatus({
        type: "error",
        message: createdTheatreName
          ? `${errorMessage} The theatre "${createdTheatreName}" was created, and ${createdScreenCount} screen${createdScreenCount === 1 ? "" : "s"} may already exist.`
          : errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  Launch theatres, assign owners, wire screens in one flow.
                </h1>
              </div>

              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                This dashboard provisions an owner account through
                {" "}
                <span className="font-semibold text-amber-100">
                  `POST /api/register`
                </span>
                {" "}
                with role `owner`, then creates the theatre through
                {" "}
                <span className="font-semibold text-amber-100">
                  `POST /api/theatres`
                </span>
                {" "}
                and creates screens through
                {" "}
                <span className="font-semibold text-amber-100">
                  `POST /api/screens`
                </span>
                {" "}
                using your logged-in admin id in the required `userid` header.
              </p>
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

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <article className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(127,29,29,0.68)_55%,_rgba(146,64,14,0.68))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100">
                    <Sparkles size={14} />
                    Build Fast
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                    Theatre onboarding with owner and screen creation built into the flow.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
                    Admins no longer need to stitch this together manually.
                    Enter the owner details, define one or more screens, and
                    the dashboard wires the whole structure automatically.
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
                      Screens mapped
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      Each screen stores row-wise seat layout.
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

              <div className="mt-5 space-y-4">
                {isLoading ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-slate-400">
                    Pulling the latest theatres from the backend...
                  </div>
                ) : theatres.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-slate-400">
                    No theatres yet. Create the first one from the panel on the right.
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
          </div>

          <aside className="rounded-[30px] border border-white/10 bg-[#101c31] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-300/10 p-3 text-amber-200">
                <Plus size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Create Theatre
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Add a new venue
                </h2>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              Signed in as
              {" "}
              <span className="font-semibold text-white">
                {currentUser?.name || "Admin"}
              </span>
              {" "}
              with user id
              {" "}
              <span className="break-all font-mono text-xs text-emerald-50">
                {currentUser?._id || "Unavailable"}
              </span>
              .
            </div>

            {status.message ? (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-50"
                    : "border-rose-400/25 bg-rose-500/10 text-rose-100"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Theatre Name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="BingeHere Grand Arena"
                  className="w-full rounded-2xl border border-white/10 bg-[#09111f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    City
                  </span>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Pune"
                    className="w-full rounded-2xl border border-white/10 bg-[#09111f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    State
                  </span>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="w-full rounded-2xl border border-white/10 bg-[#09111f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Full Address
                </span>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Plot 9, MG Road, Near Riverside Plaza"
                  className="w-full rounded-2xl border border-white/10 bg-[#09111f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#0b1424] p-4">
                <p className="text-sm font-semibold text-white">
                  Theatre Owner Account
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  These details will create a new user with role `owner`.
                </p>

                <div className="mt-4 grid gap-4">
                  <div className="relative">
                    <UserRound
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Owner full name"
                      className="w-full rounded-2xl border border-white/10 bg-[#09111f] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      placeholder="owner@theatre.com"
                      className="w-full rounded-2xl border border-white/10 bg-[#09111f] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                    />
                  </div>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      placeholder="Owner phone number"
                      className="w-full rounded-2xl border border-white/10 bg-[#09111f] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                    />
                  </div>

                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="password"
                      name="ownerPassword"
                      value={formData.ownerPassword}
                      onChange={handleChange}
                      placeholder="Temporary owner password"
                      className="w-full rounded-2xl border border-white/10 bg-[#09111f] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1424] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Screens</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Add one or more screens and define the row-wise seat layout.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addScreen}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/20"
                  >
                    <Plus size={14} />
                    Add Screen
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {formData.screens.map((screen, screenIndex) => (
                    <div
                      key={`screen-${screenIndex}`}
                      className="rounded-2xl border border-white/10 bg-[#09111f] p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Screen {screenIndex + 1}
                          </p>
                          <p className="text-xs text-slate-400">
                            Total seats preview: {getTotalSeats(screen.seatLayout)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeScreen(screenIndex)}
                          disabled={formData.screens.length === 1}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <input
                          type="text"
                          value={screen.name}
                          onChange={(event) =>
                            handleScreenChange(screenIndex, "name", event.target.value)
                          }
                          placeholder="Screen name"
                          className="w-full rounded-2xl border border-white/10 bg-[#111c31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                        />

                        <div className="space-y-3">
                          {screen.seatLayout.map((seatRow, rowIndex) => (
                            <div
                              key={`screen-${screenIndex}-row-${rowIndex}`}
                              className="grid gap-3 sm:grid-cols-[0.7fr_1fr_auto]"
                            >
                              <input
                                type="text"
                                value={seatRow.row}
                                onChange={(event) =>
                                  handleSeatRowChange(
                                    screenIndex,
                                    rowIndex,
                                    "row",
                                    event.target.value,
                                  )
                                }
                                placeholder="Row"
                                className="w-full rounded-2xl border border-white/10 bg-[#111c31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                              />
                              <input
                                type="number"
                                min="1"
                                value={seatRow.seats}
                                onChange={(event) =>
                                  handleSeatRowChange(
                                    screenIndex,
                                    rowIndex,
                                    "seats",
                                    event.target.value,
                                  )
                                }
                                placeholder="Seats"
                                className="w-full rounded-2xl border border-white/10 bg-[#111c31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                              />
                              <button
                                type="button"
                                onClick={() => removeSeatRow(screenIndex, rowIndex)}
                                disabled={screen.seatLayout.length === 1}
                                className="inline-flex items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-3 text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => addSeatRow(screenIndex)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                        >
                          <Plus size={14} />
                          Add Seat Row
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#f59e0b,_#ef4444)] px-4 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={16} />
                {isSubmitting
                  ? "Creating owner, theatre, and screens..."
                  : "Create Owner + Theatre + Screens"}
              </button>
            </form>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Loader from "../../components/Common/Loader.jsx";
import { registerUser } from "../../services/auth.services";
import { createTheatre } from "../../services/theatre.services";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const buildInitialForm = () => ({
  name: "",
  city: "",
  state: "",
  address: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerPassword: "",
});

const CreateTheatre = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => parseStoredUser());
  const [formData, setFormData] = useState(() => buildInitialForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    document.title = "BingeHere | Create Theatre";
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
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

    let createdOwnerEmail = "";
    let createdTheatreName = "";

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

      setFormData(buildInitialForm());
      setStatus({
        type: "success",
        message: `"${createdTheatre.name}" was created and assigned to owner ${createdOwnerEmail}.`,
      });
    } catch (error) {
      const errorMessage = error.message || "Theatre creation failed.";

      setStatus({
        type: "error",
        message: createdTheatreName
          ? `${errorMessage} The theatre "${createdTheatreName}" was created.`
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

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <Loader isLoading={isSubmitting} />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.25),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(250,204,21,0.18),_transparent_35%)]" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100">
                <ShieldCheck size={14} />
                Admin
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
                  Create Theatre
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Add a new venue
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
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

        <section className="mt-6">
          <aside className="rounded-[30px] border border-white/10 bg-[#101c31] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="mt-1 flex items-center gap-3">
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
              Signed in as{" "}
              <span className="font-semibold text-white">
                {currentUser?.name || "Admin"}
              </span>{" "}
              with user id{" "}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#f59e0b,_#ef4444)] px-4 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={16} />
                {isSubmitting
                  ? "Creating owner and theatre..."
                  : "Create Owner + Theatre"}
              </button>
            </form>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default CreateTheatre;

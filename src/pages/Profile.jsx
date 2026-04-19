import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, IdCard, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar2 } from "../components/landing/LandingPage2/Navbar2";
// import { updatePassword } from "../services/auth.services";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.title = "BingeHere | Profile";
    try {
      const storedUser = localStorage.getItem("user");
      setUserProfile(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUserProfile(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    const resolvedUserId =
      userProfile?._id ?? userProfile?.id ?? userProfile?.userId;

    if (!resolvedUserId) {
      toast.error("User id missing. Please log in again.");
      return;
    }

    if (!previousPassword || !newPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setIsUpdating(true);
      const payload = {
        userId: resolvedUserId,
        previousPassword,
        newPassword,
      };
      const response = await updatePassword(payload);
      toast.success(response.message || "Password updated successfully.");
      setPreviousPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-[#0b0f1a] min-h-screen font-sans text-slate-100">
      <Navbar2 />

      <main className="pt-24 pb-10 px-6 md:px-10">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] p-8 md:p-10">
          <div className="absolute -top-24 -right-16 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-20 h-52 w-52 rounded-full bg-rose-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Welcome back, {userProfile?.name || "Cinephile"}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Your account details and quick actions live here.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
            <h2 className="text-xl font-semibold text-white">
              Account Information
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Keep your profile up to date for a smoother booking experience.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-300">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Name
                  </p>
                  <p className="text-base font-semibold text-white">
                    {userProfile?.name || "Guest User"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Email
                  </p>
                  <p className="text-base font-semibold text-white">
                    {userProfile?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Phone
                  </p>
                  <p className="text-base font-semibold text-white">
                    {userProfile?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                  <IdCard size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    User Id
                  </p>
                  <p className="text-base font-semibold text-white">
                    {userProfile?._id ||
                      userProfile?.id ||
                      userProfile?.userId ||
                      "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
              <h3 className="text-lg font-semibold text-white">
                Update Password
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your current password to set a new one.
              </p>

              <form onSubmit={handlePasswordUpdate} className="mt-4 grid gap-3">
                <input
                  type="password"
                  placeholder="Previous password"
                  value={previousPassword}
                  onChange={(event) => setPreviousPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0b0f1a] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0b0f1a] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0b0f1a] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#131a2e] p-6">
            <h2 className="text-xl font-semibold text-white">
              Membership Snapshot
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Perks and quick stats tailored for you.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Status
                </p>
                <p className="text-lg font-semibold text-rose-200">
                  Cinephile Member
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Next Reward
                </p>
                <p className="text-base font-semibold text-white">
                  Unlock a free popcorn combo
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Book one more show to claim.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Watchlist
                </p>
                <p className="text-base font-semibold text-white">
                  12 titles saved
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;

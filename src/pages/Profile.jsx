import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IdCard,
  Lock,
  LogOut,
  Mail,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { updatePassword } from "../services/auth.services";

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
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 transition"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-slate-400">
            Manage your account details and security.
          </p>
        </div>

        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <User size={18} className="text-slate-200" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>

          <div className="space-y-3">
            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Name
              </p>
              <p className="text-base font-semibold text-white mt-1">
                {userProfile?.name || "Guest User"}
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Mail size={14} /> Email
              </p>
              <p className="text-base font-semibold text-white mt-1">
                {userProfile?.email || "Not available"}
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Phone size={14} /> Phone
              </p>
              <p className="text-base font-semibold text-white mt-1">
                {userProfile?.phone || "Not available"}
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <IdCard size={14} /> User Id
              </p>
              <p className="text-sm font-semibold text-white mt-1 break-all">
                {userProfile?._id ||
                  userProfile?.id ||
                  userProfile?.userId ||
                  "Not available"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <Lock size={18} className="text-slate-200" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <h3 className="text-base font-semibold text-white">
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
        </section>
      </div>
    </div>
  );
};

export default Profile;

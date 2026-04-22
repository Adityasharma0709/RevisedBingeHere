import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { ArrowRight, Gift, HelpCircle, LogOut, Settings, ShoppingBag ,Popcorn} from "lucide-react";
import Button from "../../ui/Button";

const menuItems = [
  {
    title: "Your Orders",
    subtitle: "View all your bookings & purchases",
    icon: ShoppingBag,
    path: "/orders",
  },
  {
    title: "Accounts & Settings",
    subtitle: "Location, Payments, Permissions & More",
    icon: Settings,
    path: "/profile",
  },
  {
    title: "Help & Support",
    subtitle: "View commonly asked queries and Chat",
    icon: HelpCircle,
    path: "/support",
  },
  {
    title:"sunday shows",
    subtitle: "vote for your Fab Show",
    icon:Popcorn,
    path:"/special"
  }
];

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  let userProfile = null;
  try {
    const storedUser = localStorage.getItem("user");
    userProfile = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    userProfile = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/auth");
  };

  const handleMenuNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="text-white px-2 py-2 shadow-none"
        backgroundColor="#ef4444"
        variant="solid"
        size="sm"
      >
        <ArrowRight size={16} />
      </Button>

      {createPortal(
        <>
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-60"
            />
          )}

          <div
            className={`fixed top-0 right-0 h-full w-[320px] bg-[#0b0f1a] text-slate-100 z-70 shadow-2xl shadow-black/60 transform transition-transform duration-300 flex flex-col
            ${open ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <FaUserCircle className="w-12 h-12 text-slate-300" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Welcome back
                  </p>
                  <p className="text-lg font-semibold">
                    {userProfile?.name || "Guest User"}
                  </p>
                  {userProfile?.email ? (
                    <p className="text-xs text-slate-400">{userProfile.email}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between bg-white/5 p-3 rounded-lg shadow-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="text-rose-400">
                    <Gift size={28} />
                  </div>
                  <p className="text-sm text-slate-300">
                    Unlock special offers & great benefits
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y overflow-y-auto flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleMenuNavigate(item.path)}
                    className="w-full flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 text-left"
                  >
                    <Icon size={20} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.subtitle ? (
                        <p className="text-xs text-slate-400">{item.subtitle}</p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-rose-300 hover:text-rose-200 bg-white/5 hover:bg-white/10 transition rounded-md py-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
};

export default SideMenu;

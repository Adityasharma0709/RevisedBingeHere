import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {
  Bell,
  ShoppingBag,
  Tv,
  HelpCircle,
  Settings,
  Gift,
  LogOut,
  Lock,
  ChevronDown,
  ChevronUp,
  Ticket,
  TicketCheck,
  ArrowRight,
} from "lucide-react";
import Button from "../../ui/Button";
const menuItems = [
  { title: "Notifications", subtitle: "", icon: Bell, locked: false },
  {
    title: "Your Orders",
    subtitle: "View all your bookings & purchases",
    icon: ShoppingBag,
    locked: false,
  },
  {
    title: "Accounts & Settings",
    subtitle: "Location, Payments, Permissions & More",
    icon: Settings,
    locked: false,
  },
  {
    title: "Rewards",
    subtitle: "View your rewards & unlock new ones",
    icon: Gift,
    locked: false,
  },
  {
    title: "Help & Support",
    subtitle: "View commonly asked queries and Chat",
    icon: HelpCircle,
    locked: false,
  },
];

const upcomingOrders = [
  { movie: "Dune 2", date: "20 Feb 2026", seats: "B5, B6", status: "Upcoming" },
  {
    movie: "Border 2",
    date: "28 Feb 2026",
    seats: "C1, C2",
    status: "Upcoming",
  },
];

const bookedOrders = [
  { movie: "Animal", date: "12 Jan 2026", seats: "A1, A2", status: "Booked" },
  { movie: "Pushpa 2", date: "20 Jan 2026", seats: "C3, C4", status: "Booked" },
];

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // which dropdown is open
  const navigate = useNavigate();
  let userProfile = null;

  try {
    const storedUser = localStorage.getItem("user");
    userProfile = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    userProfile = null;
  }

  const toggleMenu = (title) => {
    setActiveMenu(activeMenu === title ? null : title);
  }; // main menu
  const [orderSection, setOrderSection] = useState(null); // "upcoming" | "booked"
  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/auth");
  };
  const handleProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  return (
    <>
      {/* Hamburger Button */}
      <Button
        onClick={() => setOpen(true)}
        className="text-white px-2 py-2 shadow-none"
        backgroundColor="#ef4444"
        variant="solid"
        size="sm"
      >
        <ArrowRight size={16} />
      </Button>

      {/* Portal for Drawer */}
      {createPortal(
        <>
          {/* Overlay */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-60"
            ></div>
          )}

          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-[320px] bg-[#0b0f1a] text-slate-100 z-70 shadow-2xl shadow-black/60 transform transition-transform duration-300 flex flex-col
            ${open ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              {/* Profile */}
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
                    <p className="text-xs text-slate-400">
                      {userProfile.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-4">Hey!</h2>

              <div className="mt-3 flex items-center justify-between bg-white/5 p-3 rounded-lg shadow-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <Gift className="text-rose-400" size={28} />
                  <p className="text-sm text-slate-300">
                    Unlock special offers & great benefits
                  </p>
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="divide-y overflow-y-auto flex-1">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const isOpen = activeMenu === item.title;

                return (
                  <div key={i}>
                    {/* Menu Row */}
                    <div
                      onClick={() => !item.locked && toggleMenu(item.title)}
                      className={`flex items-center gap-3 p-4 cursor-pointer ${
                        item.locked ? "text-slate-500" : "hover:bg-white/5"
                      }`}
                    >
                      <Icon size={20} />

                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-slate-400">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {item.locked ? (
                        <Lock size={16} />
                      ) : isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>

                    {/* Dropdown Content */}
                    {isOpen && (
                      <div className="bg-white/5 px-4 py-3 text-sm border-t border-white/10">
                        {item.title === "Your Orders" ? (
                          <div className="space-y-2">
                            {/* Upcoming dropdown */}
                            <div>
                              <div
                                onClick={() =>
                                  setOrderSection(
                                    orderSection === "upcoming"
                                      ? null
                                      : "upcoming",
                                  )
                                }
                                className="flex justify-between items-center cursor-pointer text-sm font-semibold text-slate-200"
                              >
                                <span className="flex items-center gap-2">
                                  <Ticket size={16} />
                                  Upcoming
                                </span>
                                <span>
                                  {orderSection === "upcoming" ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </span>
                              </div>

                              {orderSection === "upcoming" && (
                                <div className="mt-2 space-y-2">
                                  {upcomingOrders.map((order, idx) => (
                                    <div
                                      key={idx}
                                      className="border border-white/10 rounded-md p-2 bg-[#0f172a]"
                                    >
                                      <p className="font-semibold">
                                        {order.movie}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {order.date} â€¢ Seats: {order.seats}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Booked dropdown */}
                            <div>
                              <div
                                onClick={() =>
                                  setOrderSection(
                                    orderSection === "booked" ? null : "booked",
                                  )
                                }
                                className="flex justify-between items-center cursor-pointer text-sm font-semibold text-slate-200"
                              >
                                <span className="flex items-center gap-2">
                                  <TicketCheck size={16} />
                                  Booked
                                </span>
                                <span>
                                  {orderSection === "booked" ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </span>
                              </div>

                              {orderSection === "booked" && (
                                <div className="mt-2 space-y-2">
                                  {bookedOrders.map((order, idx) => (
                                    <div
                                      key={idx}
                                      className="border border-white/10 rounded-md p-2 bg-[#0f172a]"
                                    >
                                      <p className="font-semibold">
                                        {order.movie}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {order.date} â€¢ Seats: {order.seats}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : item.title === "Accounts & Settings" ? (
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={handleProfile}
                              className="w-full px-1 py-1 text-left text-sm font-semibold text-slate-300 hover:text-rose-400 transition"
                            >
                              View Profile
                            </button>
                          </div>
                        ) : (
                          <p className="text-slate-400">
                            {item.title} options will appear here.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Footer */}
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

import { useState } from "react";
import {
  Bell,
  ShoppingBag,
  Tv,
  CreditCard,
  HelpCircle,
  Settings,
  Gift,
  RefreshCcw,
  Lock,
  ChevronDown,
  ChevronUp,
  Ticket,
  TicketCheck,
} from "lucide-react";

const menuItems = [
  { title: "Notifications", subtitle: "", icon: Bell, locked: false },
  {
    title: "Your Orders",
    subtitle: "View all your bookings & purchases",
    icon: ShoppingBag,
    locked: false,
  },
  {
    title: "Stream Library",
    subtitle: "Rented & Purchased Movies",
    icon: Tv,
    locked: true,
  },
  {
    title: "Play Credit Card",
    subtitle: "View your Play Credit Card details and offers",
    icon: CreditCard,
    locked: false,
  },
  {
    title: "Help & Support",
    subtitle: "View commonly asked queries and Chat",
    icon: HelpCircle,
    locked: false,
  },
  {
    title: "Accounts & Settings",
    subtitle: "Location, Payments, Permissions & More",
    icon: Settings,
    locked: true,
  },
  {
    title: "Rewards",
    subtitle: "View your rewards & unlock new ones",
    icon: Gift,
    locked: false,
  },
  { title: "BookAChange", subtitle: "", icon: RefreshCcw, locked: false },
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

  const toggleMenu = (title) => {
    setActiveMenu(activeMenu === title ? null : title);
  }; // main menu
  const [orderSection, setOrderSection] = useState(null); // "upcoming" | "booked"

  return (
    <>
      {/* Hamburger Button */}
      <button onClick={() => setOpen(true)} className="text-2xl">
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Hey!</h2>

          <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Gift className="text-red-500" size={28} />
              <p className="text-sm text-gray-600">
                Unlock special offers & great benefits
              </p>
            </div>
            <button className="border border-red-500 text-red-500 px-3 py-1 text-sm rounded-md">
              Login / Register
            </button>
          </div>
        </div>

        {/* Menu List */}
        <div className="divide-y overflow-y-auto h-[calc(100%-120px)]">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isOpen = activeMenu === item.title;

            return (
              <div key={i}>
                {/* Menu Row */}
                <div
                  onClick={() => !item.locked && toggleMenu(item.title)}
                  className={`flex items-center gap-3 p-4 cursor-pointer ${
                    item.locked ? "text-gray-400" : "hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
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
                  <div className="bg-gray-50 px-4 py-3 text-sm">
                    {item.title === "Your Orders" ? (
                      <div className="space-y-2">
                        {/* Upcoming dropdown */}
                        <div>
                          <div
                            onClick={() =>
                              setOrderSection(
                                orderSection === "upcoming" ? null : "upcoming",
                              )
                            }
                            className="flex justify-between items-center cursor-pointer text-sm font-semibold text-gray-700"
                          >
                            <span className="flex items-center"><Ticket size={18}/>Upcoming</span>
                            <span>
                              {orderSection === "upcoming" ?<ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </span>
                          </div>

                          {orderSection === "upcoming" && (
                            <div className="mt-2 space-y-2">
                              {upcomingOrders.map((order, idx) => (
                                <div
                                  key={idx}
                                  className="border rounded-md p-2 bg-white"
                                >
                                  <p className="font-semibold">{order.movie}</p>
                                  <p className="text-xs text-gray-600">
                                    {order.date} • Seats: {order.seats}
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
                            className="flex justify-between items-center cursor-pointer text-sm font-semibold text-gray-700"
                          >
                            <span><TicketCheck size={18}/></span>
                            <span>{orderSection === "booked" ?<ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                          </div>

                          {orderSection === "booked" && (
                            <div className="mt-2 space-y-2">
                              {bookedOrders.map((order, idx) => (
                                <div
                                  key={idx}
                                  className="border rounded-md p-2 bg-white"
                                >
                                  <p className="font-semibold">{order.movie}</p>
                                  <p className="text-xs text-gray-600">
                                    {order.date} • Seats: {order.seats}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        {item.title} options will appear here.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SideMenu;

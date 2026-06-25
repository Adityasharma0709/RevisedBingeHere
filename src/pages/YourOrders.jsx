import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, TicketCheck } from "lucide-react";
import Loader from "../components/Common/Loader.jsx";
import { getUserBookings } from "../services/booking.service";
import { getShowById } from "../services/show.service";

const normalizeBookingsResponse = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.bookings)) return result.bookings;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};

export default function YourOrders() {
  const navigate = useNavigate();

  const userId = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      return user?._id || user?.id || localStorage.getItem("userId") || "";
    } catch {
      return localStorage.getItem("userId") || "";
    }
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!userId) {
        setIsLoading(false);
        setBookings([]);
        setError("Please login to view your bookings.");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const result = await getUserBookings(userId);
        const rawBookings = normalizeBookingsResponse(result);

        const showCache = new Map();
        const withShow = await Promise.all(
          rawBookings.map(async (booking) => {
            const rawShow =
              booking?.show || booking?.showId || booking?.show_id || null;
            const showId =
              typeof rawShow === "string"
                ? rawShow
                : typeof rawShow === "object" && rawShow?._id
                  ? rawShow._id
                  : typeof booking?.showId === "string"
                    ? booking.showId
                    : null;

            if (!showId) return { ...booking, __show: rawShow };
            if (typeof rawShow === "object" && rawShow?.startTime) {
              return { ...booking, __show: rawShow };
            }

            if (showCache.has(showId)) {
              return { ...booking, __show: showCache.get(showId) };
            }

            try {
              const show = await getShowById(showId);
              showCache.set(showId, show);
              return { ...booking, __show: show };
            } catch {
              return { ...booking, __show: rawShow };
            }
          }),
        );

        if (cancelled) return;
        setBookings(withShow);
      } catch (err) {
        if (cancelled) return;
        setBookings([]);
        setError(err?.message || "Failed to fetch bookings.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const orders = useMemo(() => {
    const parseDate = (value) => {
      if (!value) return null;
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const formatWhen = (d) => {
      if (!d) return "Date/time unavailable";
      const date = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return `${date} • ${time}`;
    };

    return (Array.isArray(bookings) ? bookings : []).map((booking) => {
      const show =
        booking?.__show ||
        (typeof booking?.showId === "object" ? booking.showId : null) ||
        booking?.show ||
        null;

      const startAt = parseDate(
        show?.startTime ||
          booking?.startTime ||
          booking?.showTime ||
          booking?.dateTime,
      );

      const movie = booking?.movie || show?.movie || null;
      const movieTitle =
        movie?.name ||
        movie?.title ||
        booking?.movieName ||
        booking?.movieTitle ||
        "Movie";

      const theatre = booking?.theatre || show?.theatre || null;
      const theatreName =
        theatre?.name || booking?.theatreName || booking?.theatre || "Theatre";
      const theatreMeta =
        theatre?.location?.address ||
        theatre?.location?.city ||
        booking?.theatreLocation ||
        booking?.location ||
        "";

      const seatsArray = Array.isArray(booking?.seats)
        ? booking.seats
        : Array.isArray(booking?.selectedSeats)
          ? booking.selectedSeats
          : [];
      const seatsText =
        seatsArray.length > 0
          ? seatsArray.join(", ")
          : typeof booking?.seats === "string"
            ? booking.seats
            : "";

      const totalPrice =
        booking?.totalPrice ?? booking?.totalAmount ?? booking?.amount ?? null;

      return {
        id: booking?._id || booking?.id || `${movieTitle}-${seatsText}`,
        startAt,
        when: formatWhen(startAt),
        movieTitle,
        theatreName,
        theatreMeta,
        seatsText,
        totalPrice,
      };
    });
  }, [bookings]);

  const upcomingOrders = useMemo(() => {
    const now = Date.now();
    return orders
      .filter((o) => o.startAt && o.startAt.getTime() > now)
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }, [orders]);

  const bookedOrders = useMemo(() => {
    const now = Date.now();
    return orders
      .filter((o) => !o.startAt || o.startAt.getTime() <= now)
      .sort(
        (a, b) =>
          (b.startAt?.getTime() || 0) - (a.startAt?.getTime() || 0),
      );
  }, [orders]);

  const OrderCard = ({ order }) => {
    return (
      <div className="border border-white/10 rounded-xl p-4 bg-white/5">
        <p className="text-base font-semibold text-white">{order.movieTitle}</p>
        <p className="text-sm text-slate-300 mt-1">{order.when}</p>
        <p className="text-sm text-slate-400">
          {order.theatreName}
          {order.theatreMeta ? ` • ${order.theatreMeta}` : ""}
        </p>
        {order.seatsText ? (
          <p className="text-sm text-slate-400 mt-1">Seats: {order.seatsText}</p>
        ) : null}
        {order.totalPrice != null ? (
          <p className="text-sm text-slate-200 mt-2">Total: ₹{order.totalPrice}</p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">
      <Loader isLoading={isLoading} />

      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-sm text-slate-400">
            View all your bookings & purchases
          </p>
        </div>

        {error ? (
          <div className="mt-6 border border-rose-500/20 bg-rose-500/10 text-rose-200 rounded-xl p-4">
            {error}
          </div>
        ) : null}

        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={18} className="text-slate-200" />
            <h2 className="text-lg font-semibold">Upcoming</h2>
          </div>

          {upcomingOrders.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-400">No upcoming bookings.</p>
          ) : (
            <div className="space-y-3">
              {upcomingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <TicketCheck size={18} className="text-slate-200" />
            <h2 className="text-lg font-semibold">Booked</h2>
          </div>

          {bookedOrders.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-400">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


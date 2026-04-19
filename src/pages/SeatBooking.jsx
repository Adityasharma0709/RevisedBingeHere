import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getShowById } from "../services/show.service";
import { createBooking } from "../services/booking.service";
import toast from "react-hot-toast";
import Loader from "../components/Common/Loader.jsx";
import "./css/SeatBooking.css";

export default function SeatBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showData, setShowData] = useState(null);
  const [seatRows, setSeatRows] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [soldSeats, setSoldSeats] = useState(new Set());
  const [user, setUser] = useState(null);

  const [activeTime, setActiveTime] = useState(state?.time || "");
  const [ticketCount, setTicketCount] = useState(state?.ticketCount || 2);
  const [showTicketModal, setShowTicketModal] = useState(() => !state?.selectedSeats?.length);
  const [selectedSeats, setSelectedSeats] = useState(() => state?.selectedSeats || []);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(60);
  const [selectedPaymentApp, setSelectedPaymentApp] = useState("GPay");
  const [foodOrder, setFoodOrder] = useState(() => {
    if (state?.foodOrder) return state.foodOrder;
    const stored = localStorage.getItem("foodOrder");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      toast.error("Please login to book tickets");
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        if (!state?.showId) {
          toast.error("Show data not found");
          navigate(-1);
          return;
        }
        
        setIsLoading(true);
        const data = await getShowById(state.showId);
        setShowData(data);
        
        if (data.bookedSeats) {
          setSoldSeats(new Set(data.bookedSeats));
        }

        if (data.pricing) {
          setSeatTypes(data.pricing.map(p => ({
            type: p.segment,
            price: p.price
          })));
        } else if (data.price) { // Fallback for old shows
           setSeatTypes([{ type: "STANDARD", price: data.price }]);
        }

        if (data.screen && data.screen.seatLayout) {
          const layout = data.screen.seatLayout.map(rowConfig => {
            let price = data.price || 200;
            if (data.pricing) {
               const pricingObj = data.pricing.find(p => p.segment === rowConfig.row);
               if (pricingObj) price = pricingObj.price;
            }
            return {
              row: rowConfig.row,
              seats: rowConfig.seats,
              price: price
            };
          });
          setSeatRows(layout);
        }

      } catch (err) {
        toast.error("Failed to load show details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShowData();
  }, [state?.showId, navigate]);

  useEffect(() => {
    if (!state?.foodOrder) return;
    setFoodOrder(state.foodOrder);
    localStorage.setItem("foodOrder", JSON.stringify(state.foodOrder));
  }, [state?.foodOrder]);

  useEffect(() => {
    if (!state?.selectedSeats) return;
    setSelectedSeats(state.selectedSeats);
  }, [state?.selectedSeats]);

  useEffect(() => {
    if (!state?.ticketCount) return;
    setTicketCount(state.ticketCount);
  }, [state?.ticketCount]);

  useEffect(() => {
    if (!showPaymentModal) return undefined;

    setPaymentTimer(60);
    const intervalId = setInterval(() => {
      setPaymentTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showPaymentModal]);

  useEffect(() => {
    if (paymentTimer === 0 && showPaymentModal) {
      toast.error("QR payment expired. Please generate a new QR code.");
    }
  }, [paymentTimer, showPaymentModal]);

  const handleSeatClick = (seatId) => {
    if (soldSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      return;
    }

    if (selectedSeats.length >= ticketCount) {
      toast.error(`You can select exactly ${ticketCount} seats`);
      return;
    }

    setSelectedSeats([...selectedSeats, seatId]);
  };

  const getSeatPrice = (seatId) => {
    const row = seatRows.find((r) => seatId.startsWith(r.row));
    return row ? row.price : 0;
  };

  const seatTotal = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  const foodTotal = foodOrder?.totalAmount || 0;
  const grandTotal = seatTotal + foodTotal;
  const paymentApps = ["GPay", "PhonePe", "Navi", "Paytm"];

  const paymentState = {
    movie: state?.movie,
    language: state?.language,
    theatre: state?.theatre,
    theatreLocation: state?.location,
    date: state?.date,
    time: activeTime,
    ticketCount,
    selectedSeats,
    seatTotal,
    foodTotal,
    foodItems: foodOrder?.items || [],
    grandTotal,
  };

  const openPaymentModal = () => {
    if (selectedSeats.length !== ticketCount) {
      toast.error(`Please select exactly ${ticketCount} seats`);
      return;
    }
    setSelectedPaymentApp("GPay");
    setShowPaymentModal(true);
  };

  const completePayment = async () => {
    try {
      setIsProcessing(true);
      
      await createBooking({
        showId: showData._id,
        seats: selectedSeats,
        totalPrice: grandTotal
      }, user._id);
      
      toast.success("Payment Received & Tickets Booked! 🎉");
      setShowPaymentModal(false);
      navigate("/payment-summary", { state: paymentState });
    } catch (err) {
      toast.error(err.message || "Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <Loader isLoading={true} />;

  return (
    <div className="seat-page">
      <div className="breadcrumb-bar">
        <span className="breadcrumb-link" onClick={() => navigate("/")}>
          {"<-"} Movies
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{state?.movie}</span>
      </div>

      <div className="seat-header-bms">
        <div className="seat-header-left">
          <div>
            <h2 className="movie-title">
              {state?.movie} ({state?.language})
            </h2>

            <div className="showtime-breadcrumb">
              <span className="showtime-pill active">
                 {activeTime}
              </span>
            </div>

            <p className="movie-subtitle">
              {state?.theatre} | {state?.date} | {activeTime}
            </p>
          </div>
        </div>

        <button className="ticket-btn" onClick={() => setShowTicketModal(true)}>
          Edit {ticketCount} Tickets
        </button>
      </div>

      {showTicketModal && (
        <div className="ticket-modal-overlay">
          <div className="ticket-modal-card">
            <h2 className="modal-title">How many seats?</h2>
            <div className="modal-illustration">Seats</div>

            <div className="seat-count-row">
              {[...Array(10)].map((_, i) => {
                const num = i + 1;
                return (
                  <span
                    key={num}
                    className={num === ticketCount ? "seat-count active" : "seat-count"}
                    onClick={() => setTicketCount(num)}
                  >
                    {num}
                  </span>
                );
              })}
            </div>

            <hr />

            <div className="seat-type-row">
              {seatTypes.map((s) => (
                <div key={s.type} className="seat-type">
                  <div className="seat-type-name">{s.type}</div>
                  <div className="seat-type-price">Rs {s.price}</div>
                  <div className="seat-type-status">AVAILABLE</div>
                </div>
              ))}
            </div>

            <button
              className="select-seat-btn"
              onClick={() => {
                setSelectedSeats([]);
                setShowTicketModal(false);
              }}
            >
              Select Seats
            </button>
          </div>
        </div>
      )}

      {!showTicketModal && (
        <>
          <div className="seat-layout">
            {seatRows.map((row) => (
              <div key={row.row} className="seat-row">
                <span className="row-label">{row.row}</span>

                <div className="seat-block">
                  {[...Array(row.seats)].map((_, i) => {
                    const seatId = `${row.row}${i + 1}`;
                    return (
                      <button
                        key={seatId}
                        className={`seat ${soldSeats.has(seatId) ? "sold" : ""} ${
                          selectedSeats.includes(seatId) ? "selected" : ""
                        }`}
                        onClick={() => handleSeatClick(seatId)}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <span className="price-label">INR {row.price}</span>
              </div>
            ))}
          </div>

          <div className="screen">
            <div className="screen-bar"></div>
            <p>All eyes this way please</p>
          </div>

          <div className="summary">
            <span>
              Seats: <b>{selectedSeats.join(", ") || "None"}</b>
            </span>
            <span>
              Food: <b>INR {foodTotal}</b>
            </span>
            <span>
              SeatPrice : <b>INR {seatTotal}</b>
            </span>

            <button
              className="food-order-btn"
              onClick={() =>
                navigate("/food-ordering", {
                  state: {
                    movie: state?.movie,
                    language: state?.language,
                    theatre: state?.theatre,
                    location: state?.location,
                    date: state?.date,
                    time: activeTime,
                    selectedSeats,
                    ticketCount,
                    foodOrder,
                    showId: state?.showId,
                  },
                })
              }
            >
              Food Ordering
            </button>

            <button
              onClick={openPaymentModal}
              disabled={selectedSeats.length !== ticketCount}
            >
              Pay INR {grandTotal}
            </button>
          </div>

          {showPaymentModal && (
            <div className="ticket-modal-overlay">
              <div className="ticket-modal-card payment-modal-card">
                <h2 className="modal-title">Scan & Pay</h2>
                <p className="payment-subtext">
                  Scan the QR code using your UPI app. QR expires in{" "}
                  <strong>{paymentTimer}s</strong>.
                </p>

                <div className="qr-box" aria-label="QR payment placeholder">
                  <div className="qr-inner">QR</div>
                </div>

                <div className="payment-apps-row">
                  {paymentApps.map((app) => (
                    <button
                      key={app}
                      type="button"
                      className={
                        app === selectedPaymentApp ? "pay-app-btn active" : "pay-app-btn"
                      }
                      onClick={() => setSelectedPaymentApp(app)}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <p className="payment-subtext">
                  Selected app: <strong>{selectedPaymentApp}</strong>
                </p>

                <div className="payment-actions-row">
                  <button
                    type="button"
                    className="secondary-pay-btn"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="select-seat-btn"
                    onClick={completePayment}
                    disabled={paymentTimer === 0 || isProcessing}
                  >
                    {isProcessing ? "Processing..." : "I Have Paid"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

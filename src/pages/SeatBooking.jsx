import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/SeatBooking.css";

const seatRows = [
  { row: "RECLINER", price: 349, seats: 25 },
  { row: "SOFA SLIDER", price: 199, seats: 16 },
  { row: "DIAMOND", price: 149, seats: 14 },
  { row: "GOLD", price: 105, seats: 12 },
];

const soldSeats = new Set(["RECLINER3", "DIAMOND7"]);

const seatTypes = [
  { type: "RECLINER", price: 349 },
  { type: "SOFA SLIDER", price: 199 },
  { type: "DIAMOND", price: 149 },
  { type: "GOLD", price: 105 },
];

const showTimes = ["09:20 AM", "12:05 PM", "04:55 PM", "07:40 PM", "10:25 PM"];

export default function SeatBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [activeTime, setActiveTime] = useState(state?.time || showTimes[0]);
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
      alert("QR payment expired. Please generate a new QR code.");
    }
  }, [paymentTimer, showPaymentModal]);

  const handleSeatClick = (seatId) => {
    if (soldSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      return;
    }

    if (selectedSeats.length >= ticketCount) {
      alert(`You can select only ${ticketCount} seats`);
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
    if (selectedSeats.length !== ticketCount) return;
    setSelectedPaymentApp("GPay");
    setShowPaymentModal(true);
  };

  const completePayment = () => {
    setShowPaymentModal(false);
    navigate("/payment-summary", { state: paymentState });
  };

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
              {showTimes.map((time) => (
                <span
                  key={time}
                  className={time === activeTime ? "showtime-pill active" : "showtime-pill"}
                  onClick={() => {
                    setActiveTime(time);
                    setSelectedSeats([]);
                  }}
                >
                  {time}
                </span>
              ))}
            </div>

            <p className="movie-subtitle">
              {state?.theatre} | {state?.date} | {activeTime}
            </p>
          </div>
        </div>

        <button className="ticket-btn" onClick={() => setShowTicketModal(true)}>
          ✎ {ticketCount} Tickets
        </button>
      </div>

      {showTicketModal && (
        <div className="ticket-modal-overlay">
          <div className="ticket-modal-card">
            <h2 className="modal-title">How many seats?</h2>
            <div className="modal-illustration">🛵</div>

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
                  <div className="seat-type-price">₹{s.price}</div>
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
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="select-seat-btn"
                    onClick={completePayment}
                    disabled={paymentTimer === 0}
                  >
                    I Have Paid
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

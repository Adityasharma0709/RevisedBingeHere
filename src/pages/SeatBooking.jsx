import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/SeatBooking.css";

/* Seat rows with prices */
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

/* Other show timings */
const showTimes = ["09:20 AM", "12:05 PM", "04:55 PM", "07:40 PM", "10:25 PM"];

export default function SeatBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [activeTime, setActiveTime] = useState(state?.time || showTimes[0]);
  const [ticketCount, setTicketCount] = useState(2);
  const [showTicketModal, setShowTicketModal] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /* Seat click */
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

  /* Price logic */
  const getSeatPrice = (seatId) => {
    const row = seatRows.find((r) => seatId.startsWith(r.row));
    return row ? row.price : 0;
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0,
  );

  return (
    <div className="seat-page">
      {/* ================= BREADCRUMB ================= */}
      <div className="breadcrumb-bar">
        <span className="breadcrumb-link" onClick={() => navigate("/")}>
          ← Movies
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{state?.movie}</span>
      </div>

      {/* ================= HEADER ================= */}
      <div className="seat-header-bms">
        <div className="seat-header-left">
          <div>
            <h2 className="movie-title">
              {state?.movie} ({state?.language})
            </h2>

            {/* ===== SHOWTIME BREADCRUMB ===== */}
            <div className="showtime-breadcrumb">
              {showTimes.map((time) => (
                <span
                  key={time}
                  className={
                    time === activeTime
                      ? "showtime-pill active"
                      : "showtime-pill"
                  }
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

      {/* ================= TICKET COUNT MODAL ================= */}
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
                    className={
                      num === ticketCount ? "seat-count active" : "seat-count"
                    }
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

      {/* ================= SEAT SELECTION ================= */}
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
                        className={`seat
                          ${soldSeats.has(seatId) ? "sold" : ""}
                          ${selectedSeats.includes(seatId) ? "selected" : ""}
                        `}
                        onClick={() => handleSeatClick(seatId)}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <span className="price-label">₹{row.price}</span>
              </div>
            ))}
          </div>

          {/* SCREEN */}
          <div className="screen">
            <div className="screen-bar"></div>
            <p>All eyes this way please</p>
          </div>

          {/* SUMMARY */}
          <div className="summary">
            <span>
              Seats: <b>{selectedSeats.join(", ") || "None"}</b>
            </span>
            <span>
              Total: <b>₹{totalPrice}</b>
            </span>

            <button disabled={selectedSeats.length !== ticketCount}>
              Pay ₹{totalPrice}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

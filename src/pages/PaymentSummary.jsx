import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/PaymentSummary.css";

const randomUsers = ["Aarav Sharma", "Isha Patel", "Rohan Verma", "Neha Singh"];
const randomUserLocations = ["Nayapalli", "Salt Lake", "Boring Road", "DLF Phase 3"];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function PaymentSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const userName = useMemo(() => pickRandom(randomUsers), []);
  const userLocation = useMemo(() => pickRandom(randomUserLocations), []);

  const ticketCount = state?.ticketCount || 0;
  const selectedSeats = state?.selectedSeats?.join(", ") || "None";
  const seatTotal = state?.seatTotal ?? state?.totalPrice ?? 0;
  const foodTotal = state?.foodTotal ?? 0;
  const grandTotal = state?.grandTotal ?? seatTotal + foodTotal;
  const foodItems = state?.foodItems || [];

  const foodItemsText =
    foodItems.length > 0
      ? foodItems.map((item) => `${item.name} x${item.quantity}`).join(", ")
      : "None";

  const handleDownloadReceipt = () => {
    const lines = [
      "BingeHere - Booking Receipt",
      "---------------------------",
      `User Name: ${userName}`,
      `User Location: ${userLocation}`,
      `Movie: ${state?.movie || "N/A"}`,
      `Language: ${state?.language || "N/A"}`,
      `Theatre: ${state?.theatre || "N/A"}`,
      `Theatre Location: ${state?.theatreLocation || "N/A"}`,
      `Date: ${state?.date || "N/A"}`,
      `Time: ${state?.time || "N/A"}`,
      `Seats: ${selectedSeats}`,
      `Tickets: ${ticketCount}`,
      `Food Items: ${foodItemsText}`,
      `Seat Total: INR ${seatTotal}`,
      `Food Total: INR ${foodTotal}`,
      `Total Paid: INR ${grandTotal}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bingehere-receipt.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-brand">
          <img src="/combined.png" alt="BingeHere logo" className="payment-brand-logo" />
          <span className="payment-brand-name">BingeHere</span>
        </div>
        <h1>Booking Confirmed</h1>
        <p className="payment-subtitle">Your ticket details</p>

        <div className="payment-grid">
          <div className="payment-item">
            <span>User Name</span>
            <strong>{userName}</strong>
          </div>
          <div className="payment-item">
            <span>User Location</span>
            <strong>{userLocation}</strong>
          </div>
          <div className="payment-item">
            <span>Movie</span>
            <strong>{state?.movie || "N/A"}</strong>
          </div>
          <div className="payment-item">
            <span>Language</span>
            <strong>{state?.language || "N/A"}</strong>
          </div>
          <div className="payment-item">
            <span>Theatre</span>
            <strong>{state?.theatre || "N/A"}</strong>
          </div>
          <div className="payment-item">
            <span>Theatre Location</span>
            <strong>{state?.theatreLocation || "N/A"}</strong>
          </div>
          <div className="payment-item">
            <span>Date and Time</span>
            <strong>
              {state?.date || "N/A"} | {state?.time || "N/A"}
            </strong>
          </div>
          <div className="payment-item">
            <span>Seats</span>
            <strong>{selectedSeats}</strong>
          </div>
          <div className="payment-item">
            <span>Tickets</span>
            <strong>{ticketCount}</strong>
          </div>
          <div className="payment-item">
            <span>Food Items</span>
            <strong>{foodItemsText}</strong>
          </div>
          <div className="payment-item">
            <span>Seat Total</span>
            <strong>INR {seatTotal}</strong>
          </div>
          <div className="payment-item">
            <span>Food Total</span>
            <strong>INR {foodTotal}</strong>
          </div>
          <div className="payment-item total">
            <span>Total Paid</span>
            <strong>INR {grandTotal}</strong>
          </div>
        </div>

        <div className="payment-actions">
          <button className="secondary-btn" onClick={handleDownloadReceipt}>
            Download Receipt
          </button>
          <button onClick={() => navigate("/showtimes")}>Book Another Show</button>
        </div>
      </div>
    </div>
  );
}

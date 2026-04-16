export default function PriceBar({ seats, onProceed }) {
  const total = seats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="price-bar">
      <div className="price-bar-copy">
        <p className="price-bar-label">
          <b>{seats.length}</b> Tickets Selected
        </p>
        <p className="price-bar-seats">
          {seats.map((seat) => seat.id).join(", ") || "Choose your seats"}
        </p>
      </div>

      <div className="price-bar-actions">
        <h3>Rs.{total}</h3>
        <button onClick={onProceed}>Proceed</button>
      </div>
    </div>
  );
}

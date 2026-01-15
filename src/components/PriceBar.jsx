// components/PriceBar.jsx

export default function PriceBar({ seats, onProceed }) {

  const total = seats.reduce((s,x)=>s+x.price,0);

  return (
    <div className="price-bar">

      <div>
        <b>{seats.length}</b> Tickets
        <p>{seats.map(s=>s.id).join(", ")}</p>
      </div>

      <div>
        <h3>₹{total}</h3>
        <button onClick={onProceed}>Proceed</button>
      </div>

    </div>
  );
}

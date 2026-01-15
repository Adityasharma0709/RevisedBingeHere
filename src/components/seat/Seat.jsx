// components/Seat.jsx
import '../seat/css/seat.css'
export default function Seat({
  row, num, booked, selected, price, onSelect
}) {

  const id = row + num;
  const isSelected = selected.some(s => s.id === id);

  return (
    <button
      disabled={booked}
      className={`seat 
        ${booked && "booked"} 
        ${isSelected && "selected"}`}
      onClick={() => onSelect(id, price)}
    >
      {num}
    </button>
  );
}

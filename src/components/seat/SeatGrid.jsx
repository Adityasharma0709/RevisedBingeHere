import Seat from "./seat";

export default function SeatGrid({ layout, selected, onSelect }) {
  return layout.map((section) => (
    <div key={section.category} className="seat-section">
      <h3 className="section-title">Rs.{section.price} {section.category}</h3>

      {section.rows.map((r) => (
        <div className="row" key={r.row}>
          <span className="row-name">{r.row}</span>

          {r.seats.map((num) => (
            <Seat
              key={num}
              row={r.row}
              num={num}
              booked={r.booked.includes(num)}
              selected={selected}
              price={section.price}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </div>
  ));
}

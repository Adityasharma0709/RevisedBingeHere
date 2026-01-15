// components/SeatGrid.jsx

import Seat from "./seat";

export default function SeatGrid({ layout, selected, onSelect }) {

  return layout.map(section => (
    <div key={section.category}>
      <h3>₹{section.price} {section.category}</h3>

      {section.rows.map(r => (
        <div className="row" key={r.row}>

          <span>{r.row}</span>

          {r.seats.map(num => (
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

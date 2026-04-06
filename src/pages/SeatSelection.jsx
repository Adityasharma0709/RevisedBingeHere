import { useEffect, useState } from "react";
import { seatMock } from "../data/seatMock";
import SeatGrid from "../components/seat/SeatGrid";
import PriceBar from "../components/PriceBar";
import "../pages/css/SeatSelection.css";

export default function SeatSelection() {

  const [layout, setLayout] = useState([]);
  const [selected, setSelected] = useState([]);

  // Load mock data (API simulation)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLayout(seatMock);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Select / Deselect seat
  const toggleSeat = (seatId, price) => {
    setSelected(prev => {
      const exists = prev.find(s => s.id === seatId);

      if (exists) {
        return prev.filter(s => s.id !== seatId);
      }

      return [...prev, { id: seatId, price }];
    });
  };

  // Proceed
  const proceed = () => {
    if (selected.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    console.log("Seats booked:", selected);
  };

  return (
    <div className="seat-selection-page">
      <div className="seat-wrapper">
        <div className="seat-selection-header">
          <p className="seat-selection-eyebrow">Choose your perfect spot</p>
          <h1>Select Your Seats</h1>
          <p className="seat-selection-subtitle">
            Pick from the available rows below and continue once your seats look
            right.
          </p>
        </div>

        <div className="seat-selection-legend">
          <span><i className="legend-dot available" /> Available</span>
          <span><i className="legend-dot selected" /> Selected</span>
          <span><i className="legend-dot booked" /> Booked</span>
        </div>

        {/* Screen indicator */}
        <div className="screen">
          SCREEN THIS SIDE
        </div>

        {/* Seat layout */}
        <SeatGrid
          layout={layout}
          selected={selected}
          onSelect={toggleSeat}
        />

      </div>

      {/* Bottom price bar */}
      <PriceBar
        seats={selected}
        onProceed={proceed}
      />
    </div>
  );
}

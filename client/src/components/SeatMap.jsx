import React from "react";

export default function SeatMap({
  layout,
  bookedSeats = [],
  lockedSeats = [],
  selected = [],
  onSelect,
  hideInactive = false,
}) {
  return (
    <div className="seatmap-container">
      <div
        style={{
          width: "80%",
          height: 20,
          backgroundColor: "#ccc",
          borderRadius: 10,
          textAlign: "center",
          margin: "0 auto 1rem",
        }}
      >
        Ekran
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {layout.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <div style={{ width: 30, textAlign: "center", fontWeight: "bold" }}>
              {String.fromCharCode(64 + row.row)}
            </div>
            {row.seats.map((seat) => {
              const sid = `${row.row}-${seat.number}`;
              const isBooked = bookedSeats.includes(sid);
              const isLocked = lockedSeats.includes(sid);
              const isSelected = selected.includes(sid);

              if (!seat.active && hideInactive) {
                return (
                  <div key={sid} style={{ width: 40, height: 40, margin: 4 }} />
                );
              }

              let style = { width: 40, height: 40, margin: 4 };
              let cls = "btn";

              if (!seat.active) {
                cls += " btn-secondary";
              } else if (isBooked) {
                cls += " btn-secondary disabled";
              } else if (isLocked) {
                cls += " btn-warning disabled";
                style.opacity = 0.6;
                style.color = "white";
              } else if (isSelected) {
                switch (row.type) {
                  case "promo":
                    style.backgroundColor = "rgb(30,125,180)";
                    style.color = "white";
                    break;
                  case "vip":
                    style.backgroundColor = "rgb(203,162,15)";
                    style.color = "white";
                    break;
                  default:
                    style.backgroundColor = "rgb(237,102,158)";
                    style.color = "white";
                }
              } else {
                switch (row.type) {
                  case "promo":
                    style.border = "2px solid rgb(128,200,242)";
                    style.backgroundColor = "rgb(244,251,255)";
                    break;
                  case "vip":
                    style.border = "2px solid rgb(250,208,57)";
                    style.backgroundColor = "rgb(255,251,238)";
                    style.color = "black";
                    break;
                  default:
                    style.border = "2px solid rgb(234,122,168)";
                    style.backgroundColor = "rgb(255,247,253)";
                    style.color = "black";
                }
              }

              return (
                <button
                  key={sid}
                  className={cls}
                  style={style}
                  disabled={isBooked || isLocked}
                  onClick={() =>
                    !isLocked &&
                    !isBooked &&
                    onSelect({ row: row.row, number: seat.number })
                  }
                >
                  {seat.number}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

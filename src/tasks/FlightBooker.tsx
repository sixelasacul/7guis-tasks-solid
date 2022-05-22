import { createSignal, createMemo } from "solid-js";

const today = new Date();
const defaultDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

export function FlightBooker() {
  const [isReturnFlight, setIsReturnFlight] = createSignal(false);
  const [startDate, setStartDate] = createSignal(defaultDate);
  const [endDate, setEndDate] = createSignal(defaultDate);

  const isRangeValid = createMemo(() => {
    return new Date(startDate()).getTime() - new Date(endDate()).getTime() <= 0;
  });

  function book() {
    const returnMessage = isReturnFlight() ? `, returning on ${endDate()}` : "";
    window.alert(`Your flight is booked for ${startDate()}${returnMessage}.`);
  }

  return (
    <div>
      <select onChange={(e) => setIsReturnFlight(e.target.value === "return")}>
        <option value="one-way" selected>
          One-way flight
        </option>
        <option value="return">Return flight</option>
      </select>
      <input
        type="date"
        value={startDate()}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate()}
        onChange={(e) => setEndDate(e.target.value)}
        disabled={!isReturnFlight()}
      />
      <button onClick={book} disabled={isReturnFlight() && !isRangeValid()}>
        Book
      </button>
    </div>
  );
}

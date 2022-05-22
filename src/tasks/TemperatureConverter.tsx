import { createSignal } from "solid-js";

function isNumber(value: string | number): value is number {
  // Handling null, undefined
  const temp = value ?? "";
  // Not catching 0
  if (temp === "") return false;
  return !Number.isNaN(Number(value));
}

function celsiusToFarenheit(celsius: number) {
  return celsius * (9 / 5) + 32;
}
function farenheitToCelsius(farenheit: number) {
  return (farenheit - 32) * (5 / 9);
}

export function TemperatureConverter() {
  const [celsius, setCelsius] = createSignal("");
  const [farnheit, setFarenheit] = createSignal("");

  function convertCelsius(value: string) {
    setCelsius(value);
    if (!!value && isNumber(value)) {
      setFarenheit(celsiusToFarenheit(value).toFixed(2));
    }
  }
  function convertFarenheit(value: string) {
    setFarenheit(value);
    if (!!value && isNumber(value)) {
      setCelsius(farenheitToCelsius(value).toFixed(2));
    }
  }

  return (
    <div>
      <label>
        <input
          value={celsius()}
          onChange={(e) => convertCelsius(e.target.value)}
        />{" "}
        Celsius
      </label>{" "}
      ={" "}
      <label>
        <input
          value={farnheit()}
          onChange={(e) => convertFarenheit(e.target.value)}
        />{" "}
        Farenheit
      </label>
    </div>
  );
}

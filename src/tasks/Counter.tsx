import { createSignal } from "solid-js";

export function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount(count() + 1);
  return (
    <div>
      <input value={count()} readonly />
      <button onClick={increment}>Count</button>
    </div>
  );
}

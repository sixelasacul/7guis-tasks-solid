import { createSignal, onCleanup } from 'solid-js'

export function Timer() {
  const [elapsedTime, setElapsedTime] = createSignal(0)
  const [duration, setDuration] = createSignal(0)

  const interval = setInterval(() => {
    if (elapsedTime() < duration()) {
      setElapsedTime((prev) => prev + 0.1)
    }
  }, 100)
  onCleanup(() => clearInterval(interval))

  return (
    <div>
      <label>
        Elapsed time: <progress value={elapsedTime()} max={duration()} />
      </label>
      <p>{elapsedTime().toFixed(1)}s</p>
      <label>
        Duration:{' '}
        <input
          type="range"
          value={duration()}
          onInput={(e) => setDuration(Number(e.target.value))}
          max="20"
          // For some reason, SolidJS is quite inconsitent with
          // state that updates a lot, so I cannot use a range
          // of 0-100 and divides that by 5 to have a smoother range
        />
      </label>
      <button onClick={() => setElapsedTime(0)}>Reset</button>
    </div>
  )
}

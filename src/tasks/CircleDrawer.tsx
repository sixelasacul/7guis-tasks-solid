import { createEffect, createMemo, createSignal } from 'solid-js'
import { Show } from 'solid-js/web'

interface Circle {
  x: number
  y: number
  radius: number
}
type Position = [number, number]

function getClickPosition(event: MouseEvent): null | Position {
  const element = event.target as Element | null
  if (!element) return null
  const rect = element.getBoundingClientRect()
  const x = event.clientX - rect.x
  const y = event.clientY - rect.y
  return [x, y]
}
function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  isHovered: boolean
) {
  context.beginPath()
  context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2)
  if (isHovered) {
    context.fill()
  } else {
    context.stroke()
  }
}
function drawCircles(
  context: CanvasRenderingContext2D,
  circles: Circle[],
  canvas: HTMLCanvasElement,
  hoveredCircle?: Circle
) {
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  const reversed = [...circles].reverse()
  const drawnCircles = new Set<string>()
  reversed.forEach(({ x, y, radius }) => {
    const key = `${x}:${y}`
    if (!drawnCircles.has(key)) {
      const isHovered = hoveredCircle
        ? hoveredCircle.x === x && hoveredCircle.y === y
        : false
      drawCircle(context, x, y, radius, isHovered)
      drawnCircles.add(key)
    }
  })
}
function getDistance([firstX, firstY]: Position, [secondX, secondY]: Position) {
  const xDistance = Math.abs(firstX - secondX)
  const yDistance = Math.abs(firstY - secondY)
  // AC^2 = AB^2 + BC^2
  const distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
  return distance
}
function getClosestCircle(event: MouseEvent, circles: Circle[]) {
  const position = getClickPosition(event)
  if (!position) return null
  return circles.reduce<[Circle | null, number]>(
    ([closestCircle, closestDistance], current) => {
      const distance = getDistance(position, [current.x, current.y])
      if (distance < current.radius && distance < closestDistance) {
        return [current, distance]
      }
      return [closestCircle, closestDistance]
    },
    [null, Number.MAX_SAFE_INTEGER]
  )[0]
}

const DEFAULT_RADIUS = 10
export function CircleDrawer() {
  let canvasRef: HTMLCanvasElement | undefined = undefined
  // Circles could be a Map of ("x:y", Circle), but signals and states work with
  // serializable primitives, which is not the case of Map
  // Otherwise, can use createStore with an Object keyed by `x:y`
  const [circles, setCircles] = createSignal<Circle[]>([])
  // Might want to encapsulate that in a store with circles?
  // So we can create selectors based on circles + history
  const [historyPointer, setHistoryPointer] = createSignal(0)
  const [hoveredCircle, setHoveredCircle] = createSignal<Circle>()
  const [selectedCircle, setSelectedCircle] = createSignal<Circle>()
  const [adjustedRadius, setAdjustedRadius] = createSignal(10)

  // Should also filtered based on already drawn circles that have been updated
  const filteredCircles = createMemo(() => circles().slice(0, historyPointer()))

  function addCircle(event: MouseEvent) {
    const position = getClickPosition(event)
    if (position) {
      const [x, y] = position
      setCircles((prev) =>
        prev.slice(0, historyPointer()).concat({ x, y, radius: DEFAULT_RADIUS })
      )
    }
  }
  function updateCircle(event: MouseEvent) {
    const updatedCircle = selectedCircle()
    if (updatedCircle) {
      const { x, y } = updatedCircle
      setCircles((prev) => prev.concat({ x, y, radius: adjustedRadius() }))
      setAdjustedRadius(DEFAULT_RADIUS)
      setSelectedCircle(undefined)
    }
  }
  function hoverCircle(event: MouseEvent) {
    setHoveredCircle(getClosestCircle(event, filteredCircles()) ?? undefined)
  }
  function handleClick(event: MouseEvent) {
    const closestCircle = getClosestCircle(event, filteredCircles())
    if (closestCircle) {
      console.log(closestCircle.radius)
      setAdjustedRadius(closestCircle.radius)
      setSelectedCircle(closestCircle)
    } else {
      addCircle(event)
    }
  }
  function undo() {
    setHistoryPointer((prev) => (prev > 0 ? prev - 1 : prev))
  }
  function redo() {
    const circlesLength = circles().length
    setHistoryPointer((prev) => (prev < circlesLength ? prev + 1 : prev))
  }

  createEffect(() => {
    setHistoryPointer(circles().length)
  })
  createEffect(() => {
    const context = canvasRef && canvasRef.getContext('2d')
    if (canvasRef && context) {
      drawCircles(context, filteredCircles(), canvasRef, hoveredCircle())
    }
  })

  return (
    <div>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={{ border: '1px solid black' }}
        onClick={handleClick}
        onMouseMove={hoverCircle}
      />
      <Show when={selectedCircle()}>
        <input
          type="range"
          min="1"
          max="100"
          value={adjustedRadius()}
          onInput={(e) => setAdjustedRadius(Number(e.target.value))}
        />
        <button onClick={updateCircle}>Ok</button>
      </Show>
    </div>
  )
}

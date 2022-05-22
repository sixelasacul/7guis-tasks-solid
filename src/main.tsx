import { render } from "solid-js/web";
import { Counter, TemperatureConverter, FlightBooker } from "./tasks";

function App() {
  return (
    <div>
      <h1>7 GUIs tasks</h1>
      <p>
        Reference:{" "}
        <a
          href="https://eugenkiss.github.io/7guis/tasks"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://eugenkiss.github.io/7guis/tasks
        </a>
      </p>
      <p>
        HackerNews source:{" "}
        <a
          href="https://news.ycombinator.com/item?id=31273802"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://news.ycombinator.com/item?id=31273802
        </a>
      </p>
      <p>
        React implementation:{" "}
        <a
          href="https://codesandbox.io/s/7guis-tasks-react-b9dzt5"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://codesandbox.io/s/7guis-tasks-react-b9dzt5
        </a>
      </p>
      <p>
        Vanilla JS implementation:{" "}
        <a
          href="https://codesandbox.io/s/7guis-tasks-js-z3oesm"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://codesandbox.io/s/7guis-tasks-js-z3oesm
        </a>
      </p>

      <div>
        <h2>1- Counter</h2>
        <Counter />
        <h2>2- Temperature Converter</h2>
        <TemperatureConverter />
        <h2>3- Flight Booker</h2>
        <FlightBooker />
      </div>
    </div>
  );
}

render(() => <App />, document.getElementById("app")!);

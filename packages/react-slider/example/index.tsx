import { useMemo } from "react";
import { render } from "react-dom";
import { SliderComponent } from "..";

const Main = () => {
  const components = useMemo(
    () => [
      <div
        key={1}
        style={{
          width: "100vw",
          height: 100,
          backgroundColor: "#FFF",
        }}
      >
        hoge
      </div>,
      <div
        key={2}
        style={{
          width: "100vw",
          height: 100,
          backgroundColor: "#AAA",
        }}
      >
        hoge
      </div>,
      <div
        key={3}
        style={{
          width: "100vw",
          height: 100,
          backgroundColor: "#555",
        }}
      >
        hoge
      </div>,
    ],
    []
  );

  return (
    <div>
      <h1>hoge</h1>
      <SliderComponent
        components={components}
        offsetLeft={0}
        copyNum={1}
        // isLoop
      />
    </div>
  );
};

render(
  <div>
    <h1>hogehoge</h1>
    <Main />
  </div>,
  document.getElementById("app")
);

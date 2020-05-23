/* eslint-env node, mocha */
/* eslint @typescript-eslint/no-unused-vars: 0 */
import React from "react";
import { render } from "react-dom";
import { SliderComponent } from "..";

const Main: React.SFC<{}> = () => {
  const components = React.useMemo(
    () => [
      <div
        key={1}
        style={{
          width: "50vw",
          height: 100,
          backgroundColor: "#000",
          color: "#FFF",
        }}
      >
        hoge
      </div>,
      <div
        key={2}
        style={{
          width: "50vw",
          height: 100,
          backgroundColor: "#AAA",
        }}
      >
        hoge
      </div>,
      <div
        key={3}
        style={{
          width: "50vw",
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
        copyNum={0}
        options={{
          wrapperWidth: window.innerWidth / 2,
          isFit: false,
          isLoop: false,

        }}
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

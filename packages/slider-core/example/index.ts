import { Slider } from "..";
import { CreateTestElement } from "./utils/TestElement";

const test = (): void => {
  const slider = new Slider(5);
  const list: Array<{ x: number; y: number }> = [];

  let startTime = 0;
  const elTest = document.getElementById("hoge");
  if (elTest == null) return;
  slider.init(elTest.scrollWidth, 5, {
    isLoop: true,
    isFit: false,
  });

  slider.update = (x) => {
    list.push({ y: x, x: performance.now() - startTime });
    elTest.style.transform = `translate(${x * -1}px)`;
  };
  slider.onEnd = () => {};

  const move = (offset: number, duration: number): Promise<void> => {
    return new Promise((r) => {
      setTimeout(() => {
        slider.update(offset);
        r();
      }, duration);
    });
  };

  const offset = Math.random() * 100;
  const movement = async (i: number): Promise<void> => {
    if (i === 1) return;
    await move(i * -1 * offset, 16);
    await movement(i - 1);
  };
  const main = async (): Promise<void> => {
    slider.start(0);
    startTime = performance.now();
    await movement(10);
    slider.end();
  };

  main().catch(() => {
    console.error("ERROR");
  });

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
};

document.body.appendChild(CreateTestElement());
test();

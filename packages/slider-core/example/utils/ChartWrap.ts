import Chart from "chart.js";

interface IGraph {
  x: number;
  y: number;
}
export const ChartWrap = (
  context: CanvasRenderingContext2D,
  data: Array<IGraph>
): Chart => {
  return new Chart(context, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Scatter Dataset",
          data,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            type: "linear",
            position: "bottom",
          },
        ],
      },
    },
  });
};

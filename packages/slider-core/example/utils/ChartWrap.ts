import Chart from 'chart.js';
interface Graph {
  x: number;
  y: number;
}
export const ChartWrap = (context: CanvasRenderingContext2D ,data: Graph[]) => {
  return new Chart(context, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Scatter Dataset',
            data,
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
  });
}
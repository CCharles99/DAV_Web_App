import React from "react";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";
import colorLib from '@kurkle/color';


Chart.register(CategoryScale);

function LineGraph({ centerDAV, centerIntensity, frame }) {

  const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    red_white: 'rgb(255,200,200)',
    blue_white: 'rgb(200,210,255)'
  };

  function circleAtFrame(ctx) {
    const index = ctx.dataIndex;
    return index === frame ? 'circle' : false;
  }

  return (
    <Line
      data={{
        labels: Array(centerDAV.length).fill(""),
        datasets: [
          {
            label: 'DAV',
            yAxisID: 'DAV',
            data: centerDAV,
            borderColor: CHART_COLORS.blue,
            backgroundColor: colorLib(CHART_COLORS.blue).alpha(0.5).rgbString(),
            pointBorderColor: CHART_COLORS.blue_white,
            borderJoinStyle: 'bevel',
            borderCapStyle: 'round'
          },
          {
            label: 'Intensity',
            yAxisID: 'Intensity',
            data: centerIntensity,
            borderColor: CHART_COLORS.red,
            backgroundColor: colorLib(CHART_COLORS.red).alpha(0.5).rgbString(),
            pointBorderColor: CHART_COLORS.red_white,
            borderJoinStyle: 'bevel',
            borderCapStyle: 'round'
          },
        ]
      }}
      options={{
        animation: false,
        elements: {
          point: {
            pointBorderWidth: 3,
            pointStyle: circleAtFrame,
            radius: 4,
            hoverRadius: 4,
          }
        },
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          DAV: {
            title: {
              display: true,
              text: 'DAV (deg\u00B2)',
              color: CHART_COLORS.blue,
              font: {
                size: 15,
              },
            },
            type: 'linear',
            position: 'left',
            min: 500,
            max: 3500,
            grid: {
              drawOnChartArea: false,
            }
          },
          Intensity: {
            title: {
              display: true,
              text: 'Intensity (kts)',
              color: CHART_COLORS.red,
              font: {
                size: 15,
              },
            },
            type: 'linear',
            position: 'right',
            min: 20,
            max: 160,
          },
        }
      }}
    />
  );
}

export default LineGraph;
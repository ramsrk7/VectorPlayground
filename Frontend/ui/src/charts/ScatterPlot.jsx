// src/charts/ScatterPlot.jsx
import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = ({ data }) => {
  const plotData = [
    {
      x: data.map(item => item.x),
      y: data.map(item => item.y),
      text: data.map(item => item.text),
      mode: 'markers+text',
      type: 'scatter',
      textposition: 'top center',
      marker: { size: 12, color: 'rgba(0, 123, 255, 0.6)' },
    },
  ];

  const layout = {
    title: 'Text Coordinates Visualization',
    xaxis: { title: 'X Coordinate' },
    yaxis: { title: 'Y Coordinate' },
    hovermode: 'closest',
    height: 600,
  };

  return <Plot data={plotData} layout={layout} />;
};

export default ScatterPlot;

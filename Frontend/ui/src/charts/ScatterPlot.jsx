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
    autosize: true, // Enable autosizing
    responsive: true, // Ensure the plot adjusts dynamically
    margin: { l: 40, r: 40, t: 50, b: 40 }, // Adjust margins to prevent clipping
  };

  const config = {
    responsive: true, // Enable responsiveness for Plotly
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', height: '100%', maxHeight: '80vh' }}>
      <Plot data={plotData} layout={layout} config={config} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ScatterPlot;

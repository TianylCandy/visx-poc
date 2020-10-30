import React, { useEffect, useState } from 'react';
import { Group } from '@visx/group';
import { LinePath, curveLinear } from '@visx/shape';
import { scaleLinear, scaleTime, scaleBand } from '@visx/scale';

import { AxisBottom, AxisLeft } from '@visx/axis';
import { timeFormat } from 'd3-time-format';

// Finally we'll embed it all in an SVG
export default function LineChart({ data, height, dataLabel }) {
  // Define the graph dimensions and margins
  const width = 500;
  const margin = { top: 20, bottom: 20, left: 30, right: 0 };

  // Then we'll create some bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  let x = d => d.letter || new Date(d.date).valueOf();
  let y = d => +d.frequency * 100 || d.close;

  let yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y)) + 1],
  });

  let xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    padding: 0.3,
  });

  if('Apple Stock' === dataLabel) {
    xScale = scaleTime({
      range: [0, xMax],
      domain: [Math.min(...data.map(x)), Math.max(...data.map(x)) * 1.002]
    });

    yScale = scaleLinear({
      range: [0, yMax],
      domain: [Math.max(...data.map(y)) * 1.1, 0], // Add 10% to the max to prevent overflow issues. This will be a tweakable thing in the config.
    });
  }

  const formatTime = timeFormat(`%m/%d/%Y`);

  const formatXLabel = timeFormat(`%b %Y`);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <AxisLeft
        scale={yScale}
        left={margin.left}
      />
      <Group left={margin.left}>
        <AxisBottom
          scale={xScale}
          top={yMax}
          numTicks={'Apple Stock' === dataLabel ? 5: 10}
          tickFormat={(value, i) => 'Apple Stock' === dataLabel ? formatXLabel(value) : value}
        />
        {data.map((point, i) => {
          return (
            <circle
              data-tip={`X: ${'Apple Stock' === dataLabel ? formatTime(x(point)) : x(point)} Y: ${y(point)}`}
              key={`point-${i}`}
              r={5}
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              fill="#0076D6"
            />
          );
        })}
        <LinePath
          data={data}
          curve={curveLinear}
          x={d => xScale(x(d))}
          y={d => yScale(y(d))}
          stroke="#003DD6"
          strokeWidth={1.5}
        />
      </Group>
    </svg>
  );
}
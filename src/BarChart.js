import React from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand, scaleTime } from '@visx/scale';

import { AxisBottom, AxisLeft } from '@visx/axis';
import { timeFormat } from 'd3-time-format';

import {Motion, spring} from 'react-motion';

// Finally we'll embed it all in an SVG
export default function BarChart({ data, height, dataLabel }) {
  // Define the graph dimensions and margins
  const width = 500;
  const margin = { top: 20, bottom: 20, left: 30, right: 0 };

  // Then we'll create some bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  let x = d => d.letter || new Date(d.date).valueOf();
  let y = d => +d.frequency * 100 || d.close;

  // And then scale the graph by our data
  let xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    padding: 0.3,
  });

  let yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y))],
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

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale, accessor) => data => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  const formatTime = timeFormat(`%m/%d/%Y`);

  const formatXLabel = timeFormat(`%b %Y`);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group left={margin.left}>
        <AxisBottom
          scale={xScale}
          top={yMax}
          tickFormat={(value, i) => 'Apple Stock' === dataLabel ? formatXLabel(value) : value}
        />
        {/* <StaggeredMotion> */}
          {data.map((d, i) => {
            const barHeight = yMax - yPoint(d);
            return (
              <Group key={`bar-${i}`}>
                <Motion defaultStyle={{height: 0, y: yMax}} style={{height: spring(barHeight), y: spring(yMax - barHeight)}}>
                {interpolated => <Bar
                  data-tip={`X: ${'Apple Stock' === dataLabel ? formatTime(x(d)) : x(d)} Y: ${y(d)}`}
                  x={xPoint(d)}
                  y={interpolated.y}
                  height={interpolated.height}
                  width={10}
                  fill="#0076D6"
                />}
                </Motion>
              </Group>
            );
          })}
        {/* </StaggeredMotion> */}
      </Group>
      <AxisLeft
        scale={yScale}
        left={margin.left}
      />
    </svg>
  );
}
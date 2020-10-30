import 'react-app-polyfill/ie11';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

import './styles.scss';

import { letterFrequency, appleStock } from '@visx/mock-data';

import BarChart from './BarChart';
import LineChart from './LineChart';

export default function App() {

  const [ data, setData ] = useState(letterFrequency);
  const [ dataLabel, setDataLabel ] = useState('Letter Frequency');

  const [ chartHeight, setChartHeight ] = useState(250);

  const swapData = () => {
    if('Letter Frequency' === dataLabel) {
      const slicedAppleStock = [];

      appleStock.forEach((row, i) => {
        // Cut down length in an arbitrary way that is still spaced out across the whole data set.
        if(i === slicedAppleStock.length * 50) {
          slicedAppleStock.push(row)
        }
      });

      // Reduce amount of data from the mock data
      setData(slicedAppleStock);
      setDataLabel('Apple Stock');
    } else {
      setData(letterFrequency);
      setDataLabel('Letter Frequency');
    }
  }

  const toggleAspectRatio = () => {
    if(250 === chartHeight) {
      setChartHeight(400)
    } else {
      setChartHeight(250)
    }
  }

  return (
    <section className="container">
      <ReactTooltip />
      <div className="row">
        <div className="col-12 mt-4 mb-4 d-flex justify-content-between">
          <h2>Displaying Data: {dataLabel}</h2>
          <div>
            <button className="btn btn-primary mr-2" onClick={() => swapData()}>Swap Data</button>
            <button className="btn btn-primary" onClick={() => toggleAspectRatio()}>Toggle Aspect Ratio</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-10">
          <h4 className="mb-3">Bar Chart</h4>
          <BarChart data={data} height={chartHeight} dataLabel={dataLabel} />
          <h4 className="mb-3">Line Chart</h4>
          <LineChart data={data} height={chartHeight} dataLabel={dataLabel} />
        </div>
      </div>
    </section>
  );
}

"use client"

import React from 'react';
import Workercard from './components/workercard/workercard';
import { Chart } from "react-google-charts";


export default function Dashboard() {
  const data = [
    [
      "Time",
      "Workers",
    ],
    [1, 37.8],
    [2, 30.9],
    [3, 25.4],
    [4, 11.7],
    [5, 11.9],
    [6, 8.8],
    [7, 7.6],
    [8, 12.3],
    [9, 16.9],
    [10, 12.8],
    [11, 5.3],
    [12, 6.6],
    [13, 4.8],
    [14, 4.2],
  ];

  const options = {
    chart: {
      title: "Time series of number of workers",
    },
  };

  return <div className='column' style={{ backgroundColor: '#F6F3F3', padding: '20px', gap: '20px' }}>
    <div className='flex-2 row' style={{ gap: '20px' }}>
      <div className='flex-1 card no-elevation' >
        <Chart
          chartType="Line"
          width="100%"
          height="100%"
          data={data}
          options={options}
        />
      </div>
      <div className='flex-1 wrap' style={{ overflow: 'scroll' }}>
        <Workercard width='50%'></Workercard>
        <Workercard width='50%'></Workercard>
        <Workercard width='50%'></Workercard>
        <Workercard width='50%'></Workercard>
        <Workercard width='50%'></Workercard>
        <Workercard width='50%'></Workercard>
      </div>
    </div>
    <div className='flex-2 card no-elevation'>

    </div>
  </div>
}



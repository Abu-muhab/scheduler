"use client"

import React from 'react';
import Workercard from './components/workercard/workercard';
import WorkerTrendChart from './components/worker_trend_chart';
import WorkerWorkloadsChart from './components/worker_workloads_chart';


export default function Dashboard() {


  return <div className='column' style={{ backgroundColor: '#F6F3F3', padding: '20px', gap: '20px' }}>
    <div className='flex-2 row' style={{ gap: '20px' }}>
      <div className='flex-1 card no-elevation' >
        <WorkerTrendChart />
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
      <WorkerWorkloadsChart />
    </div>
  </div>
}



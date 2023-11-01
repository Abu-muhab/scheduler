"use server"

import React from 'react';
import Workercard from './components/workercard/workercard';
import WorkerTrendChart from './components/worker_trend_chart';
import WorkerWorkloadsChart from './components/worker_workloads_chart';
import { workersRepository, Worker } from './data/workers.repo';


export default async function Dashboard() {
  let { workers, workerCountTrend } = await workersRepository.getWorkers();


  return <div className='column' style={{ backgroundColor: '#F6F3F3', padding: '20px', gap: '20px' }}>
    <div className='flex-2 row' style={{ gap: '20px' }}>
      <div className='flex-1 card no-elevation' >
        <WorkerTrendChart workerCountTrend={workerCountTrend} />
      </div>
      <div className='flex-1 wrap' style={{ overflow: 'scroll' }}>
        {
          ...workers.map(worker => {
            return <Workercard key={worker.id} width='50%' worker={worker}></Workercard>;
          })
        }
      </div>
    </div>
    <div className='flex-2 card no-elevation'>
      <WorkerWorkloadsChart />
    </div>
  </div>
}



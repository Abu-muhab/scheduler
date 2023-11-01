"use client"

import React, { useState, useEffect } from 'react';
import Workercard from './components/workercard/workercard';
import WorkerTrendChart from './components/worker_trend_chart';
import WorkerWorkloadsChart from './components/worker_workloads_chart';
import { workersRepository, Worker } from './data/workers.repo';

export default function Dashboard() {
  interface WorkersData {
    workers: Worker[];
    workerCountTrend: number[];
  }

  const [workersData, setWorkersData] = useState<WorkersData>({
    workers: [],
    workerCountTrend: [],
  });

  const getWorkersData = async () => {
    const { workers, workerCountTrend } = await workersRepository.getWorkers();
    setWorkersData({
      workers: workers as Worker[],
      workerCountTrend: workerCountTrend as number[],
    });
  };

  useEffect(() => {
    // Call getWorkersData initially when the component mounts
    getWorkersData();


    const intervalId = setInterval(getWorkersData, 5000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (workersData.workers.length === 0) {
    //TODO: Add a loading spinner
    return <div></div>
  }

  return (
    <div className='column' style={{ backgroundColor: '#F6F3F3', padding: '20px', gap: '20px' }}>
      <div className='flex-2 row' style={{ gap: '20px' }}>
        <div className='flex-1 card no-elevation'>
          {/* <WorkerTrendChart workerCountTrend={workersData.workerCountTrend} /> */}
          {workersData.workerCountTrend.length > 0 ? (
            <WorkerTrendChart workerCountTrend={workersData.workerCountTrend} />
          ) : null}
        </div>
        <div className='flex-1 wrap' style={{ overflow: 'scroll' }}>
          {workersData.workers.map((worker: Worker) => (
            <Workercard key={worker.id} width='50%' worker={worker}></Workercard>
          ))}
        </div>
      </div>
      <div className='flex-2 card no-elevation'>
        {workersData.workers.length > 0 ? (
          <WorkerWorkloadsChart workers={workersData.workers} />
        ) : null}
      </div>
    </div>
  );
}

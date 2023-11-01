export interface Worker {
  id: string;
  lastHeartbeat: String;
  uptime: string;
  queueDispatchCount: number;
  shards: number[];
}

class WorkersRepository {
  async getWorkers(): Promise<{
    workers: Worker[];
    workerCountTrend: number[];
  }> {
    const response = await fetch(`${process.env.SERVER_URL}/workers`, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  }
}

export const workersRepository = new WorkersRepository();

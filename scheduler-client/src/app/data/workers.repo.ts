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
    console.log(
      `fetching workers from ${
        process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL
      }/workers`,
    );
    const response = await fetch(
      `${process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL}/workers`,
      {
        cache: 'no-cache',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  }
}

export const workersRepository = new WorkersRepository();

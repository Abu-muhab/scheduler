export interface Worker {
  id: string;
  lastHeartbeat: String;
  uptime: string;
}

class WorkersRepository {
  async getWorkers(): Promise<Worker[]> {
    const response = await fetch(`${process.env.SERVER_URL}/workers`, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const workers = await response.json();
    return workers;
  }
}

export const workersRepository = new WorkersRepository();

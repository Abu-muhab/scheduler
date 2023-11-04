import { Injectable, Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { catchError, of } from 'rxjs';
import { getUnixTimeStampMuniteGranularity } from 'src/job/util';
import { Worker } from '../worker/worker';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const workerCountTrend: number[] = [];
const workerQueueDispatchCount: Map<string, number> = new Map();

let workers: Worker[] = [];
let addingWorker = false;
export const assignableShardLength = 5;
const shardStatus: Map<number, boolean> = new Map();

//initialize shard status
for (let i = 1; i <= assignableShardLength; i++) {
  shardStatus.set(i, false);
}

@Injectable()
export class MasterService {
  constructor() {}

  async getWorkers(): Promise<Worker[]> {
    return workers;
  }

  async addWorker(params: { workerId: string }): Promise<Worker> {
    const release = await mutex.acquire();

    try {
      if (workers.find((worker) => worker.id === params.workerId)) {
        return workers.find((worker) => worker.id === params.workerId);
      }

      const newWorker = new Worker({
        id: params.workerId,
        lastHeartbeat: new Date(),
        connectedAt: new Date(),
        shards: [],
      });

      workers.push(newWorker);
      let shard = this.getNextShard();
      this.assignShard(newWorker.id, shard);

      this.updateWorkerLengthTrend();

      return newWorker;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      release();
    }
  }

  registerHeartbeat(params: { workerId: string }): boolean {
    let worker = workers.find((worker) => worker.id === params.workerId);
    if (!worker) {
      return false;
    }
    worker.updateLastHeartbeat(new Date());
    return true;
  }

  getNextShard(): number {
    //return the first unassigned shard
    for (let [shard, assigned] of shardStatus) {
      if (!assigned) {
        return shard;
      }
    }

    //if all shards are assigned and a worker has more than 1 shard, unassign a shard
    const worker = workers.find((worker) => worker.shards.length > 1);
    if (worker) {
      let shard = worker.shards[0];
      this.unAssignShard(shard);
      return shard;
    }

    //if all shards are assigned and all workers have 1 shard, return -1
    return -1;
  }

  unAssignShard(shard: number) {
    const worker = workers.find((worker) => worker.shards.includes(shard));
    if (worker) {
      worker.updateShards(worker.shards.filter((s) => s !== shard));
    }
    shardStatus.set(shard, false);
  }

  assignShard(workerId: string, shard: number) {
    const worker = workers.find((worker) => worker.id === workerId);
    if (worker) {
      worker.addShard(shard);
    }
    shardStatus.set(shard, true);
  }

  @Cron('*/5 * * * * *')
  removeDeadWorkers() {
    const deadWorkers = workers.filter(
      (worker) => new Date().getTime() - worker.lastHeartbeat.getTime() > 60000,
    );

    deadWorkers.forEach((worker) => {
      worker.shards.forEach((shard) => this.unAssignShard(shard));
      console.log('dead worker:', worker.id);
    });

    workers = workers.filter(
      (worker) => !deadWorkers.map((w) => w.id).includes(worker.id),
    );

    this.updateWorkerLengthTrend();
  }

  @Cron('*/5 * * * * *')
  shardAssignment() {
    this._assignUnassignedShardsToIdleWorkers();
    this._assignUnassignedShardsToWorkersWithLowestShardCount();
  }

  private _assignUnassignedShardsToIdleWorkers() {
    let idleWorkers = workers.filter((worker) => worker.shards.length === 0);

    for (let [shard, status] of shardStatus) {
      if (!status && idleWorkers.length > 0) {
        const worker = idleWorkers.pop();
        this.assignShard(worker.id, shard);
      }
    }
  }

  private _assignUnassignedShardsToWorkersWithLowestShardCount() {
    let workersWithLowestShardCount = workers
      .filter((worker) => worker.shards.length > 0)
      .sort((a, b) => a.shards.length - b.shards.length);

    for (let [shard, status] of shardStatus) {
      if (!status && workersWithLowestShardCount.length > 0) {
        const worker = workersWithLowestShardCount.pop();
        this.assignShard(worker.id, shard);
      }
    }
  }

  @Cron('*/1 * * * *')
  async dispatchQueueWorkCommand() {
    try {
      const activeWorkers = workers.filter(
        (worker) => worker.shards.length > 0,
      );

      for (let worker of activeWorkers) {
        const client = ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.AMPQ_URL],
            queue: `${worker.id}-queue`,
            queueOptions: {
              durable: false,
            },
          },
        });
        await client.connect();
        for (let shard of worker.shards) {
          Logger.log(
            `dispatching queue command to worker ${worker.id} for shard ${shard}`,
          );

          client
            .send<number>(
              { cmd: 'queueJobs' },
              {
                shard,
                timestamp: getUnixTimeStampMuniteGranularity(new Date()),
              },
            )
            .pipe(
              catchError((e) => {
                console.log(e);
                return of(false);
              }),
            )
            .subscribe((response) => {
              if (response) {
                this.addWorkerQueueDispatchCount(worker.id, response as number);
              }
            });
        }

        setTimeout(() => {
          client.close();
        }, 5000);
      }
    } catch (e) {
      console.log(e);
    }
  }

  updateWorkerLengthTrend() {
    workerCountTrend.push(workers.length);
    if (workerCountTrend.length > 10) {
      workerCountTrend.shift();
    }
  }

  getWorkerCountTrend(): number[] {
    return workerCountTrend;
  }

  addWorkerQueueDispatchCount(workerId: string, value: number) {
    const count = workerQueueDispatchCount.get(workerId) || 0;
    workerQueueDispatchCount.set(workerId, count + value);
  }

  getQueueDispatchCount(workerId: string): number {
    return workerQueueDispatchCount.get(workerId) || 0;
  }
}

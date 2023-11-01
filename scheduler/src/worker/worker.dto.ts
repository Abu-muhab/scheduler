import { ApiProperty } from '@nestjs/swagger';
import { Worker } from './worker';
import { dateToTimeAgo, secondsToTimeAgo } from '../util/date.util';

export class WorkerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lastHeartbeat: String;

  @ApiProperty()
  shards: number[];

  @ApiProperty()
  uptime: string;

  @ApiProperty()
  queueDispatchCount: number;

  static fromDomain(worker: Worker, queueDispatchCount: number): WorkerDto {
    return {
      id: worker.id,
      lastHeartbeat: dateToTimeAgo(worker.lastHeartbeat),
      shards: worker.shards,
      uptime: secondsToTimeAgo(worker.uptime),
      queueDispatchCount: queueDispatchCount,
    };
  }
}

export class GetWorkersResponse {
  @ApiProperty()
  workers: WorkerDto[];

  @ApiProperty()
  workerCountTrend: number[];
}

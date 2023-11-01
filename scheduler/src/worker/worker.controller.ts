import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobQueueService } from './worker.service';

@Controller()
export class JobQueueController {
  constructor(private queueService: JobQueueService) {}

  @MessagePattern({ cmd: 'queueJobs' })
  async queueJobs(params: {
    shard: number;
    timestamp: number;
  }): Promise<number> {
    return await this.queueService.queueJobsByShard(params);
  }

  @MessagePattern({ cmd: 'requeueJobs' })
  async requeueJobs(params: {
    shard: number;
    timestamp: number;
  }): Promise<number> {
    return await this.queueService.reQueueMissedJobs(params);
  }
}

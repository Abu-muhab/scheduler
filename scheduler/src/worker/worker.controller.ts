import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class JobQueueController {
  constructor(private queueService: WorkerService) {}

  @MessagePattern({ cmd: 'queueJobs' })
  async queueJobs(params: {
    shard: number;
    timestamp: number;
  }): Promise<number> {
    return await this.queueService.queueJobsByShard(params);
  }
}

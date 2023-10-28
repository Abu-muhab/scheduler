import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WorkerManagerService } from './worker-manager.service';

@Controller()
export class WorkerManagerController {
  constructor(private readonly workerManagerService: WorkerManagerService) {}

  @MessagePattern({ cmd: 'registerWorker' })
  async registerWorker(params: { id: string }): Promise<boolean> {
    try {
      await this.workerManagerService.addWorker(params);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @MessagePattern({ cmd: 'heartbeat' })
  heartbeat(params: { id: string }): boolean {
    try {
      return this.workerManagerService.registerHeartbeat(params);
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MasterService } from './master.service';

@Controller()
export class MasterController {
  constructor(private readonly workerManagerService: MasterService) {}

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

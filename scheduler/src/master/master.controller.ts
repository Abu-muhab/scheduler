import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MasterService } from './master.service';
import { GetWorkersResponse, WorkerDto } from '../worker/worker.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @MessagePattern({ cmd: 'registerWorker' })
  async registerWorker(params: { workerId: string }): Promise<boolean> {
    try {
      await this.masterService.addWorker(params);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @MessagePattern({ cmd: 'heartbeat' })
  heartbeat(params: { workerId: string }): boolean {
    try {
      return this.masterService.registerHeartbeat(params);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Get('workers')
  @ApiOperation({ summary: 'Get all workers' })
  @ApiResponse({ status: 200, type: GetWorkersResponse, isArray: true })
  async getWorkers(): Promise<GetWorkersResponse> {
    const workers = await this.masterService.getWorkers();

    return {
      workers: workers.map((worker) => {
        return WorkerDto.fromDomain(
          worker,
          this.masterService.getQueueDispatchCount(worker.id),
        );
      }),
      workerCountTrend: this.masterService.getWorkerCountTrend(),
    };
  }
}

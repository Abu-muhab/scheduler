import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { JobDto, MessageResponse } from './dtos';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class JobController {
  constructor(private jobService: JobService) {}

  @MessagePattern({ cmd: 'createJob' })
  async createJob(body: any): Promise<boolean> {
    try {
      await this.jobService.createJob({
        ownerId: body.ownerId,
        jobType: body.jobType,
        interval: body.interval,
        scheduledTime: body.scheduledTime,
        data: {
          name: body.data.name,
          data: body.data.data,
        },
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @MessagePattern({ cmd: 'deleteJob' })
  async deleteJob(query: any): Promise<boolean> {
    try {
      await this.jobService.deleteJob(query);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @MessagePattern({ cmd: 'jobExists' })
  async getJob(query: any): Promise<boolean> {
    try {
      const job = await this.jobService.getJob(query);
      if (job) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

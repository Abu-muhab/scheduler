import { Body, Controller, Post } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateJobRequest, JobDto } from './dtos';

@Controller('jobs')
@ApiTags('Job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a job',
  })
  @ApiResponse({
    status: 201,
    description: 'The job has been successfully created.',
    type: JobDto,
  })
  async createJob(@Body() request: CreateJobRequest): Promise<JobDto> {
    const job = await this.jobService.createJob({
      jobType: request.jobType,
      interval: request.interval,
      scheduledTime: request.scheduledTime,
      data: {
        name: request.data.name,
        data: request.data.data,
      },
    });
    return JobDto.fromDomain(job);
  }

  async deleteJob(query: any): Promise<boolean> {
    try {
      await this.jobService.deleteJob(query);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

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

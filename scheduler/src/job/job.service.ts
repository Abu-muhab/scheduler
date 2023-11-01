import { Injectable } from '@nestjs/common';
import { Job, JobData, JobRepository, JobType } from './domain';
import { ScheduledJob } from './domain/job_schedule';
import { ScheduledJobRepository } from './domain/schedule_repository';
import {
  convertToServerTimeZone,
  getUnixTimeStampMuniteGranularity,
} from './util';
import { randomUUID } from 'crypto';
import { RequiredPropertyException } from './domain/exceptions';

@Injectable()
export class JobService {
  constructor(
    private jobRepository: JobRepository,
    private jobScheduleRepository: ScheduledJobRepository,
  ) {}

  async createJob(params: {
    jobType: string;
    interval: number;
    scheduledTime?: Date;
    data: {
      name: string;
      data: any;
    };
  }): Promise<Job> {
    let jobType = JobType.fromString(params.jobType);
    if (jobType == JobType.ONE_TIME && !params.scheduledTime) {
      throw new RequiredPropertyException('scheduledTime');
    }
    if (!params.data) {
      throw new RequiredPropertyException('data');
    }

    const job = new Job({
      jobType: jobType,
      interval: params.interval,
      id: randomUUID(),
      scheduledTime: params.scheduledTime,
      data: new JobData({
        name: params.data.name,
        data: params.data.data,
      }),
    });
    await this.jobRepository.add(job);

    if (jobType == JobType.RECURRING) {
      const jobSchedule = new ScheduledJob({
        jobId: job.id,
        nextExecution: getUnixTimeStampMuniteGranularity(
          new Date(Date.now() + params.interval * 1000),
        ),
        id: randomUUID(),
      });
      await this.jobScheduleRepository.add(jobSchedule);
    } else {
      const jobSchedule = new ScheduledJob({
        jobId: job.id,
        nextExecution: getUnixTimeStampMuniteGranularity(
          convertToServerTimeZone(new Date(params.scheduledTime)),
        ),
        id: randomUUID(),
      });
      await this.jobScheduleRepository.add(jobSchedule);
    }
    return job;
  }

  async markScheduledJobAsQueued(jobId: string): Promise<void> {
    const scheduledJob = await this.jobScheduleRepository.findById(jobId);
    scheduledJob.markAsQueued();
    await this.jobScheduleRepository.update(scheduledJob);
  }

  async deleteJob(query: any): Promise<void> {
    const jobs = await this.jobRepository.getJobFromCustomQuery(query);
    for (let job of jobs) {
      await this.jobRepository.delete(job);
      const schedules = await this.jobScheduleRepository.getSchedulesByJobId(
        job.id,
      );
      for (let schedule of schedules) {
        await this.jobScheduleRepository.delete(schedule);
      }
    }
  }

  async getJob(query: any): Promise<Job> {
    const jobs = await this.jobRepository.getJobFromCustomQuery(query);
    if (jobs.length > 0) {
      return jobs[0];
    }
    return null;
  }
}

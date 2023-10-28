import { Injectable } from '@nestjs/common';
import { Job, JobData, JobRepository, JobType } from './domain';
import { JobSchedule } from './domain/job_schedule';
import { JobScheduleRepository } from './domain/schedule_repository';
import {
  convertToServerTimeZone,
  getUnixTimeStampMuniteGranularity,
} from './util';
import { randomUUID } from 'crypto';

@Injectable()
export class JobService {
  constructor(
    private jobRepository: JobRepository,
    private jobScheduleRepository: JobScheduleRepository,
  ) {}

  async createJob(params: {
    ownerId: string;
    jobType: string;
    interval: number;
    scheduledTime?: Date;
    data: {
      name: string;
      data: any;
    };
  }): Promise<void> {
    try {
      let jobType = JobType.fromString(params.jobType);
      if (jobType == JobType.ONE_TIME && !params.scheduledTime) {
        throw new Error('Scheduled time is required for one time job');
      }
      if (!params.data) {
        throw new Error('Job data is required');
      }

      const job = new Job({
        ownerId: params.ownerId,
        jobType: jobType,
        interval: params.interval,
        id: randomUUID(),
        data: new JobData({
          name: params.data.name,
          data: params.data.data,
        }),
      });
      await this.jobRepository.add(job);

      if (jobType == JobType.RECURRING) {
        const jobSchedule = new JobSchedule({
          jobId: job.id,
          nextExecution: getUnixTimeStampMuniteGranularity(
            new Date(Date.now() + params.interval * 1000),
          ),
          id: randomUUID(),
        });
        await this.jobScheduleRepository.add(jobSchedule);
      } else {
        const jobSchedule = new JobSchedule({
          jobId: job.id,
          nextExecution: getUnixTimeStampMuniteGranularity(
            convertToServerTimeZone(new Date(params.scheduledTime)),
          ),
          id: randomUUID(),
        });
        await this.jobScheduleRepository.add(jobSchedule);
      }
    } catch (err) {
      console.log('err', err);
      throw err;
    }
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
}

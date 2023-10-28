import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Job,
  JobRepository,
  JobSchedule,
  JobScheduleRepository,
  JobService,
  JobType,
} from '../job';
@Injectable()
export class JobQueueService {
  constructor(
    private jobScheduleRepository: JobScheduleRepository,
    private jobRepository: JobRepository,
    protected amqpConnection: AmqpConnection,
    private jobService: JobService,
  ) {}

  async ququeJobs(
    scheduledJobs: JobSchedule[],
    options?: {
      requeueOptions?: {
        timestamp?: number;
      };
    },
  ) {
    //push each job to queue
    for (let scheduledJob of scheduledJobs) {
      //get the job
      const job: Job = await this.jobRepository.findById(scheduledJob.jobId);

      //queue the job
      this.amqpConnection.publish(
        'scheduler',
        job.data.name,
        JSON.stringify(job.data.data),
      );

      //mark the jscheduled job as queued
      await this.jobService.markScheduledJobAsQueued(scheduledJob.id);

      //create the next schedule if the job is recurring
      if (job.jobType == JobType.RECURRING) {
        const newSchedule = new JobSchedule({
          id: randomUUID(),
          shard: scheduledJob.shard,
          jobId: scheduledJob.jobId,
          nextExecution:
            (options?.requeueOptions?.timestamp || scheduledJob.nextExecution) +
            job.interval,
        });
        await this.jobScheduleRepository.add(newSchedule);
      }
    }
  }

  async queueJobsByShard(params: {
    shard: number;
    timestamp: number;
  }): Promise<boolean> {
    try {
      const scheduledJobs =
        await this.jobScheduleRepository.getDueSchedulesByShard(
          params.shard,
          params.timestamp,
        );

      await this.ququeJobs(scheduledJobs);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async reQueueMissedJobs(params: {
    shard: number;
    timestamp: number;
  }): Promise<boolean> {
    try {
      const scheduledJobs =
        await this.jobScheduleRepository.getMissedSchedulesByShard(
          params.shard,
          params.timestamp,
        );

      await this.ququeJobs(scheduledJobs, {
        requeueOptions: {
          timestamp: params.timestamp,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Job,
  JobRepository,
  ScheduledJob,
  ScheduledJobRepository,
  JobService,
  JobType,
} from '../job';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { Observable, catchError, of } from 'rxjs';

let connected = false;
export let workerId = randomUUID();

@Injectable()
export class WorkerService {
  constructor(
    private jobScheduleRepository: ScheduledJobRepository,
    private jobRepository: JobRepository,
    protected amqpConnection: AmqpConnection,
    private jobService: JobService,
    @Inject('WORKER_MANAGER') private client: ClientProxy,
  ) {}

  async queueJobs(scheduledJobs: ScheduledJob[], timestamp: number) {
    //push each job to queue
    for (let scheduledJob of scheduledJobs) {
      //get the job
      const job: Job = await this.jobRepository.findById(scheduledJob.jobId);

      //queue the job
      this.amqpConnection.publish(
        'scheduler_execution_exchange',
        job.data.name,
        JSON.stringify(job.data.data),
      );

      //mark the jscheduled job as queued
      await this.jobService.markScheduledJobAsQueued(scheduledJob.id);

      //create the next schedule if the job is recurring
      if (job.jobType == JobType.RECURRING) {
        const newSchedule = new ScheduledJob({
          id: randomUUID(),
          shard: scheduledJob.shard,
          jobId: scheduledJob.jobId,
          nextExecution: timestamp + job.interval,
        });
        await this.jobScheduleRepository.add(newSchedule);
      }
    }
  }

  async queueJobsByShard(params: {
    shard: number;
    timestamp: number;
  }): Promise<number> {
    try {
      const scheduledJobs =
        await this.jobScheduleRepository.getDueScheduledJobs(
          params.shard,
          params.timestamp,
        );

      await this.queueJobs(scheduledJobs, params.timestamp);

      return scheduledJobs.length;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  @Cron('*/10 * * * * *')
  connectToMaster() {
    if (!connected) {
      try {
        const response: Observable<boolean> = this.client.send<boolean>(
          { cmd: 'registerWorker' },
          {
            id: workerId,
          },
        );

        response
          .pipe(
            catchError((err) => {
              console.log(err);
              return of(false);
            }),
          )
          .subscribe((res) => {
            if (res) {
              connected = true;
              console.log('Connected to master!');
            } else {
              console.log('Failed to connect to master!: ' + res);
            }
          });
      } catch (_) {}
    }
  }

  @Cron('*/45 * * * * *')
  sendHeartbeat() {
    if (connected) {
      try {
        const response: Observable<boolean> = this.client.send<boolean>(
          { cmd: 'heartbeat' },
          {
            id: workerId,
          },
        );

        response
          .pipe(
            catchError((err) => {
              console.log(err);
              return of(false);
            }),
          )
          .subscribe((res) => {
            if (res) {
              console.log('Heartbeat sent!');
            } else {
              console.log('Failed to send heartbeat!: ' + res);

              //force reconnect
              connected = false;
            }
          });
      } catch (_) {}
    }
  }
}

import { JobSchedule } from './job_schedule';

export abstract class JobScheduleRepository {
  abstract delete(schedule: JobSchedule): Promise<void>;
  abstract update(scheduledJob: JobSchedule): Promise<void>;
  abstract findById(jobId: string): Promise<JobSchedule>;
  abstract add(newSchedule: JobSchedule): Promise<void>;
  abstract getDueScheduledJobs(
    shard: number,
    timestamp: number,
  ): Promise<JobSchedule[]>;

  abstract getMissedSchedulesByShard(
    shard: number,
    timestamp: number,
  ): Promise<JobSchedule[]>;

  abstract getSchedulesByJobId(jobId: string): Promise<JobSchedule[]>;
}

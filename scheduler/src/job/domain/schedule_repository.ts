import { ScheduledJob } from './job_schedule';

export abstract class ScheduledJobRepository {
  abstract delete(schedule: ScheduledJob): Promise<void>;
  abstract update(scheduledJob: ScheduledJob): Promise<void>;
  abstract findById(jobId: string): Promise<ScheduledJob>;
  abstract add(newSchedule: ScheduledJob): Promise<void>;
  abstract getDueScheduledJobs(
    shard: number,
    timestamp: number,
  ): Promise<ScheduledJob[]>;

  abstract getMissedSchedulesByShard(
    shard: number,
    timestamp: number,
  ): Promise<ScheduledJob[]>;

  abstract getSchedulesByJobId(jobId: string): Promise<ScheduledJob[]>;
}

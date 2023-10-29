import { Job } from './job';

export abstract class JobRepository {
  abstract delete(job: Job): Promise<void>;
  abstract findById(jobId: string): Promise<Job>;
  abstract getJobFromCustomQuery(query: any): Promise<Job[]>;
  abstract add(job: Job): Promise<void>;
}

import { Injectable } from '@nestjs/common';
import mongoose, { Schema } from 'mongoose';
import { Job } from '../domain/job';
import { JobRepository } from '../domain/job_repository';
import { JobMapper } from './job_mapper';

export class JobDocument {
  id: string;
  jobType: string;
  interval: number;
  scheduledTime?: Date;
  data: {
    name: string;
    data: any;
  };
}

const jobSchema = new Schema<JobDocument>({
  id: { type: String, required: true, unique: true },
  jobType: { type: String, required: true },
  interval: { type: Number, required: false },
  scheduledTime: { type: Date, required: false },
  data: {
    type: {
      name: String,
      data: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
    required: true,
  },
});

const myDB = mongoose.connection.useDb('scheduler');
const JobModel = myDB.model<JobDocument>('Job', jobSchema);

@Injectable()
export class JobRepositoryImpl extends JobRepository {
  constructor(private mapper: JobMapper) {
    super();
  }

  async getJobFromCustomQuery(query: any): Promise<Job[]> {
    const jobs = await JobModel.find(query);
    return jobs.map((job) => this.mapper.toDomain(job));
  }

  async findById(jobId: string): Promise<Job> {
    const job = await JobModel.findOne({ id: jobId });
    return this.mapper.toDomain(job);
  }

  async delete(job: Job): Promise<void> {
    await JobModel.findOneAndDelete({ id: job.id });
  }

  async add(job: Job): Promise<void> {
    const jobModel = new JobModel(this.mapper.toPersistence(job));
    await jobModel.save();
  }
}

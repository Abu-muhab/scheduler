import { Injectable } from '@nestjs/common';
import mongoose, { Schema } from 'mongoose';
import { JobSchedule } from '../domain/job_schedule';
import { JobScheduleRepository } from '../domain/schedule_repository';
import { JobScheduleMapper } from './job_schedule_mapper';

export class JobScheduleDocument {
  id: string;
  jobId: string;
  nextExecution: number;
  shard: number;
  queued: boolean;
}

const jobScheduleSchema = new Schema<JobScheduleDocument>({
  id: { type: String, required: true, unique: true },
  jobId: { type: String, required: true },
  nextExecution: { type: Number, required: true },
  shard: { type: Number, required: true },
  queued: { type: Boolean, required: true },
});

const myDB = mongoose.connection.useDb('scheduler');
const JobScheduleModel = myDB.model<JobScheduleDocument>(
  'JobSchedule',
  jobScheduleSchema,
);

@Injectable()
export class JobScheduleRepositoryImpl extends JobScheduleRepository {
  constructor(private mapper: JobScheduleMapper) {
    super();
  }

  async getSchedulesByJobId(jobId: string): Promise<JobSchedule[]> {
    const jobSchedulesDocs = await JobScheduleModel.find({ jobId });
    return jobSchedulesDocs.map((doc) => this.mapper.toDomain(doc));
  }

  async getMissedSchedulesByShard(
    shard: number,
    timestamp: number,
  ): Promise<JobSchedule[]> {
    const jobScheduleDocs = await JobScheduleModel.find({
      shard,
      nextExecution: { $lt: timestamp },
      queued: false,
    });
    return jobScheduleDocs.map((doc) => this.mapper.toDomain(doc));
  }

  async getDueScheduledJobs(
    shard: number,
    timestamp: number,
  ): Promise<JobSchedule[]> {
    const jobScheduleDocs = await JobScheduleModel.find({
      shard,
      nextExecution: { $lte: timestamp },
      queued: false,
    });
    return jobScheduleDocs.map((doc) => this.mapper.toDomain(doc));
  }

  async add(newSchedule: JobSchedule): Promise<void> {
    const scheduleDoc = this.mapper.toPersistence(newSchedule);
    const schedule = new JobScheduleModel(scheduleDoc);
    await schedule.save();
  }

  async delete(schedule: JobSchedule): Promise<void> {
    await JobScheduleModel.findOneAndDelete({ id: schedule.id });
  }

  async update(scheduledJob: JobSchedule): Promise<void> {
    await JobScheduleModel.updateOne(
      { id: scheduledJob.id },
      this.mapper.toPersistence(scheduledJob),
    );
  }

  async findById(jobId: string): Promise<JobSchedule> {
    const scheduleDoc = await JobScheduleModel.findOne({ id: jobId });
    return this.mapper.toDomain(scheduleDoc);
  }
}

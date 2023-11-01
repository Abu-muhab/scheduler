import { Injectable } from '@nestjs/common';
import mongoose, { Schema } from 'mongoose';
import { ScheduledJob } from '../domain/job_schedule';
import { ScheduledJobRepository } from '../domain/schedule_repository';
import { ScheduledJobMapper } from './job_schedule_mapper';

export class ScheduledJobDocument {
  id: string;
  jobId: string;
  nextExecution: number;
  shard: number;
  queued: boolean;
}

const jobScheduleSchema = new Schema<ScheduledJobDocument>({
  id: { type: String, required: true, unique: true },
  jobId: { type: String, required: true },
  nextExecution: { type: Number, required: true },
  shard: { type: Number, required: true },
  queued: { type: Boolean, required: true },
});

const myDB = mongoose.connection.useDb('scheduler');
const JobScheduleModel = myDB.model<ScheduledJobDocument>(
  'ScheduledJob',
  jobScheduleSchema,
);

@Injectable()
export class ScheduledJobRepositoryImpl extends ScheduledJobRepository {
  constructor(private mapper: ScheduledJobMapper) {
    super();
  }

  async getSchedulesByJobId(jobId: string): Promise<ScheduledJob[]> {
    const jobSchedulesDocs = await JobScheduleModel.find({ jobId });
    return jobSchedulesDocs.map((doc) => this.mapper.toDomain(doc));
  }

  async getMissedSchedulesByShard(
    shard: number,
    timestamp: number,
  ): Promise<ScheduledJob[]> {
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
  ): Promise<ScheduledJob[]> {
    const jobScheduleDocs = await JobScheduleModel.find({
      shard,
      nextExecution: { $lte: timestamp },
      queued: false,
    });
    return jobScheduleDocs.map((doc) => this.mapper.toDomain(doc));
  }

  async add(newSchedule: ScheduledJob): Promise<void> {
    const scheduleDoc = this.mapper.toPersistence(newSchedule);
    const schedule = new JobScheduleModel(scheduleDoc);
    await schedule.save();
  }

  async delete(schedule: ScheduledJob): Promise<void> {
    await JobScheduleModel.findOneAndDelete({ id: schedule.id });
  }

  async update(scheduledJob: ScheduledJob): Promise<void> {
    await JobScheduleModel.updateOne(
      { id: scheduledJob.id },
      this.mapper.toPersistence(scheduledJob),
    );
  }

  async findById(jobId: string): Promise<ScheduledJob> {
    const scheduleDoc = await JobScheduleModel.findOne({ id: jobId });
    return this.mapper.toDomain(scheduleDoc);
  }
}

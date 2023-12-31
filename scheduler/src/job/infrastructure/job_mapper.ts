import { Injectable } from '@nestjs/common';
import { JobDocument } from './job_repo_impl';
import { Job, JobData, JobType } from '../domain';

@Injectable()
export class JobMapper {
  toPersistence(entity: Job): JobDocument {
    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      jobType: entity.jobType,
      interval: entity.interval,
      scheduledTime: entity.scheduledTime,
      data: {
        name: entity.data.name,
        data: entity.data.data,
      },
    };
  }
  toDomain(document: JobDocument): Job {
    if (!document) {
      return null;
    }

    return new Job({
      id: document.id,
      jobType: JobType.fromString(document.jobType),
      interval: document.interval,
      scheduledTime: document.scheduledTime,
      data: new JobData({
        name: document.data.name,
        data: document.data.data,
      }),
    });
  }
}

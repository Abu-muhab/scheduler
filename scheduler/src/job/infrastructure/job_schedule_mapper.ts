import { Injectable } from '@nestjs/common';
import { JobSchedule } from '../domain/job_schedule';
import { JobScheduleDocument } from './schedule_repo_impl';

@Injectable()
export class JobScheduleMapper {
  toPersistence(entity: JobSchedule): JobScheduleDocument {
    if (!entity) {
      return null;
    }

    return {
      jobId: entity.jobId,
      nextExecution: entity.nextExecution,
      id: entity.id,
      shard: entity.shard,
      queued: entity.queued,
    };
  }
  toDomain(document: JobScheduleDocument): JobSchedule {
    if (!document) {
      return null;
    }

    return new JobSchedule({
      jobId: document.jobId,
      nextExecution: document.nextExecution,
      id: document.id,
      shard: document.shard,
      queued: document.queued,
    });
  }
}

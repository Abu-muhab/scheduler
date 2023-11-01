import { Injectable } from '@nestjs/common';
import { ScheduledJob } from '../domain/job_schedule';
import { ScheduledJobDocument } from './schedule_repo_impl';

@Injectable()
export class ScheduledJobMapper {
  toPersistence(entity: ScheduledJob): ScheduledJobDocument {
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
  toDomain(document: ScheduledJobDocument): ScheduledJob {
    if (!document) {
      return null;
    }

    return new ScheduledJob({
      jobId: document.jobId,
      nextExecution: document.nextExecution,
      id: document.id,
      shard: document.shard,
      queued: document.queued,
    });
  }
}

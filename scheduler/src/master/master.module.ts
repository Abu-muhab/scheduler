import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobRepository } from '../job/domain';
import { ScheduledJobRepository } from '../job/domain/schedule_repository';
import { JobMapper, JobRepositoryImpl } from '../job/infrastructure';
import { ScheduledJobMapper } from '../job/infrastructure/job_schedule_mapper';
import { ScheduledJobRepositoryImpl } from '../job/infrastructure/schedule_repo_impl';
import { JobController } from '../job/job.controller';
import { JobService } from '../job/job.service';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MasterController, JobController],
  providers: [
    //services
    MasterService,
    JobService,

    //mappers
    JobMapper,
    ScheduledJobMapper,

    //repositories
    {
      provide: JobRepository,
      useClass: JobRepositoryImpl,
    },
    {
      provide: ScheduledJobRepository,
      useClass: ScheduledJobRepositoryImpl,
    },
  ],
})
export class MasterModule {}

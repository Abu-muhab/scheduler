import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobRepository } from './job/domain';
import { JobScheduleRepository } from './job/domain/schedule_repository';
import { JobMapper, JobRepositoryImpl } from './job/infrastructure';
import { JobScheduleMapper } from './job/infrastructure/job_schedule_mapper';
import { JobScheduleRepositoryImpl } from './job/infrastructure/schedule_repo_impl';
import { JobController } from './job/job.controller';
import { JobService } from './job/job.service';
import { WorkerManagerController } from './worker-manager/worker-manager.controller';
import { WorkerManagerService } from './worker-manager/worker-manager.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [WorkerManagerController, JobController],
  providers: [
    //services
    WorkerManagerService,
    JobService,

    //mappers
    JobMapper,
    JobScheduleMapper,

    //repositories
    {
      provide: JobRepository,
      useClass: JobRepositoryImpl,
    },
    {
      provide: JobScheduleRepository,
      useClass: JobScheduleRepositoryImpl,
    },
  ],
})
export class AppModule {}

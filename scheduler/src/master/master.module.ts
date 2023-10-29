import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobRepository } from '../job/domain';
import { JobScheduleRepository } from '../job/domain/schedule_repository';
import { JobMapper, JobRepositoryImpl } from '../job/infrastructure';
import { JobScheduleMapper } from '../job/infrastructure/job_schedule_mapper';
import { JobScheduleRepositoryImpl } from '../job/infrastructure/schedule_repo_impl';
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
export class MasterModule {}

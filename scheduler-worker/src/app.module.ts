import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './worker-jobs.service';
import { JobQueueController } from './job-queue/job-queue.controller';
import { JobQueueService } from './job-queue/job-queue.service';
import {
  JobMapper,
  JobRepository,
  JobRepositoryImpl,
  JobScheduleMapper,
  JobScheduleRepository,
  JobScheduleRepositoryImpl,
  JobService,
} from './job';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'WORKER_MANAGER',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMPQ_URL],
          queue: 'scheduler_master_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'scheduler',
          type: 'direct',
        },
      ],
      uri: process.env.AMPQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [JobQueueController],
  providers: [
    //services
    TaskService,
    JobService,
    JobQueueService,

    //mappers
    JobMapper,
    JobScheduleMapper,

    //repos
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

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { JobQueueController } from './worker.controller';
import {
  JobService,
  JobMapper,
  ScheduledJobMapper,
  JobRepository,
  JobRepositoryImpl,
  ScheduledJobRepository,
  ScheduledJobRepositoryImpl,
} from '../job';
import { WorkerService } from './worker.service';

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
          name: 'scheduler_execution_exchange',
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
    JobService,
    WorkerService,

    //mappers
    JobMapper,
    ScheduledJobMapper,

    //repos
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
export class WorkerModule {}

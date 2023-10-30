import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { JobQueueController } from './worker.controller';
import {
  JobService,
  JobMapper,
  JobScheduleMapper,
  JobRepository,
  JobRepositoryImpl,
  JobScheduleRepository,
  JobScheduleRepositoryImpl,
} from '../job';
import { JobQueueService } from './worker.service';

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
export class WorkerModule {}

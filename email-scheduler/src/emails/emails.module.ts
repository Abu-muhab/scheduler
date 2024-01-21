import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  providers: [EmailsService],
  controllers: [EmailsController],
  imports: [
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
})
export class EmailsModule {}

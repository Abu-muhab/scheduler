import { NestFactory } from '@nestjs/core';
import { MasterModule } from './master/master.module';
import mongoose from 'mongoose';
import { Transport } from '@nestjs/microservices';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WorkerModule } from './worker/worker.module';
import { workerId } from './worker/worker.service';

declare const module: any;

async function bootstrap() {
  mongoose.connect(
    process.env.DB_URL,
    {
      retryWrites: false,
    },
    async (err) => {
      if (err) {
        console.log(err);
      } else {
        const schedulerNode = process.env.SCHEDULER_NODE;
        let app: INestApplication;

        if (schedulerNode === 'master') {
          console.log(`Starting master node`);
          app = await NestFactory.create(MasterModule);
          app.connectMicroservice({
            transport: Transport.RMQ,
            options: {
              urls: [process.env.AMPQ_URL],
              queue: 'scheduler_master_queue',
              queueOptions: {
                durable: false,
              },
            },
          });

          app.useGlobalPipes(new ValidationPipe());

          const config = new DocumentBuilder()
            .setTitle('scheduler API')
            .setDescription('The scheduler API description')
            .setVersion('1.0')
            .build();

          const document = SwaggerModule.createDocument(app, config);
          SwaggerModule.setup('docs', app, document);

          await app.startAllMicroservices();
          await app.listen(3000);
        } else {
          console.log(`Starting worker node ${workerId}`);
          app = await NestFactory.create(WorkerModule);
          app.connectMicroservice({
            transport: Transport.RMQ,
            options: {
              urls: [process.env.AMPQ_URL],
              queue: `${workerId}-queue`,
              queueOptions: {
                durable: false,
              },
            },
          });

          await app.startAllMicroservices();
          await app.listen(3000);
        }

        if (module.hot) {
          module.hot.accept();
          module.hot.dispose(() => app.close());
        }
      }
    },
  );
}
bootstrap();

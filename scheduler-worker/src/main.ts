import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { workerId } from './worker-jobs.service';

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
        const app = await NestFactory.create(AppModule);
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

        if (module.hot) {
          module.hot.accept();
          module.hot.dispose(() => app.close());
        }
      }
    },
  );
}
bootstrap();

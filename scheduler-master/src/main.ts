import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

        if (module.hot) {
          module.hot.accept();
          module.hot.dispose(() => app.close());
        }
      }
    },
  );
}
bootstrap();

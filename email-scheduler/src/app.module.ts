import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [EmailsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

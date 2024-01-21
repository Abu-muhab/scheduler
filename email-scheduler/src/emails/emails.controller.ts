import { Body, Controller, Post } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ScheduleEmailRequest } from './dtos';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('schedule')
  async scheduleEmail(@Body() request: ScheduleEmailRequest): Promise<any> {
    return this.emailsService.scheduleEmail(request);
  }
}

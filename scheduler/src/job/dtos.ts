import { ApiProperty, PickType } from '@nestjs/swagger';
import { Job, JobType } from './domain';
import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class MessageResponse {
  @ApiProperty()
  message: string;
}

export class JobDataDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  data: any;
}

export class JobDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: JobType,
  })
  @IsNotEmpty()
  jobType: string;

  @ApiProperty()
  interval: number;

  @ApiProperty({
    required: false,
  })
  scheduledTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  data: JobDataDto;

  static fromDomain(job: Job): JobDto {
    return {
      id: job.id,
      jobType: job.jobType,
      interval: job.interval,
      scheduledTime: job.scheduledTime,
      data: {
        name: job.data.name,
        data: job.data.data,
      },
    };
  }
}

export class CreateJobRequest extends PickType(JobDto, [
  'jobType',
  'interval',
  'scheduledTime',
  'data',
] as const) {}

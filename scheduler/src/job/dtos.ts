import { ApiProperty } from '@nestjs/swagger';
import { JobType } from './domain';
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
  data: string;
}

export class JobDto {
  @ApiProperty()
  @IsNotEmpty()
  ownerId: string;

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
}

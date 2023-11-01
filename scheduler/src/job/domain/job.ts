import { HttpException, HttpStatus } from '@nestjs/common';
import { RequiredPropertyException } from './exceptions';

export enum JobType {
  RECURRING = 'recurring',
  ONE_TIME = 'one-time',
}

export namespace JobType {
  export function fromString(value: string): JobType {
    if (value === JobType.RECURRING) {
      return JobType.RECURRING;
    } else if (value === JobType.ONE_TIME) {
      return JobType.ONE_TIME;
    } else {
      throw new HttpException('Invalid JobType', HttpStatus.BAD_REQUEST);
    }
  }
}

export class JobData {
  private _name: string;
  private _data: any;

  constructor(params: { name: string; data: string }) {
    this.name = params.name;
    this.data = params.data;
  }

  get name(): string {
    return this._name;
  }

  private set name(value: string) {
    if (!value) {
      throw new RequiredPropertyException('job.data.name');
    }
    this._name = value;
  }

  get data(): any {
    return this._data;
  }

  private set data(value: any) {
    if (value === undefined || value === null) {
      throw new RequiredPropertyException('job.data.data');
    }
    this._data = value;
  }
}

export class Job {
  private _id: string;
  private _jobType: JobType;
  private _interval: number;
  private _scheduledTime?: Date;
  private _data: JobData;

  constructor(params: {
    id: string;
    jobType: JobType;
    interval: number;
    scheduledTime?: Date;
    data: JobData;
  }) {
    this.id = params.id;
    this.jobType = params.jobType;
    this.interval = params.interval;
    this.scheduledTime = params.scheduledTime;
    this.data = params.data;

    if (this.jobType === JobType.RECURRING && !this.interval) {
      throw new RequiredPropertyException('interval');
    }
  }

  get id(): string {
    return this._id;
  }

  private set id(value: string) {
    if (!value) {
      throw new RequiredPropertyException('id');
    }
    this._id = value;
  }

  get jobType(): JobType {
    return this._jobType;
  }

  private set jobType(value: JobType) {
    if (!value) {
      throw new RequiredPropertyException('jobType');
    }

    this._jobType = value;
  }

  get interval(): number {
    return this._interval;
  }

  private set interval(value: number) {
    if (value < 60) {
      throw new HttpException(
        'interval must be equal to or greater than 60 seconds',
        HttpStatus.BAD_REQUEST,
      );
    }
    this._interval = value;
  }

  get scheduledTime(): Date {
    return this._scheduledTime;
  }

  private set scheduledTime(value: Date) {
    this._scheduledTime = value;
  }

  get data(): JobData {
    return this._data;
  }

  private set data(value: JobData) {
    if (value === undefined || value === null) {
      throw new RequiredPropertyException('data');
    }
    this._data = value;
  }
}

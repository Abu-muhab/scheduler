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
      throw new Error('Invalid JobType');
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
      throw new Error('Name is required');
    }
    this._name = value;
  }

  get data(): any {
    return this._data;
  }

  private set data(value: any) {
    if (!value) {
      throw new Error('Data is required');
    }
    this._data = value;
  }
}

export class Job {
  private _ownerId: string;
  private _id: string;
  private _jobType: JobType;
  private _interval: number;
  private _data: JobData;

  constructor(params: {
    ownerId: string;
    id: string;
    jobType: JobType;
    interval: number;
    data: JobData;
  }) {
    this.ownerId = params.ownerId;
    this.id = params.id;
    this.jobType = params.jobType;
    this.interval = params.interval;
    this.data = params.data;

    if (this.jobType === JobType.RECURRING && !this.interval) {
      throw new Error('Interval is required for recurring jobs');
    }
  }

  get ownerId(): string {
    return this._ownerId;
  }

  private set ownerId(value: string) {
    if (!value) {
      throw new Error('OwnerId is required');
    }
    this._ownerId = value;
  }

  get id(): string {
    return this._id;
  }

  private set id(value: string) {
    if (!value) {
      throw new Error('Id is required');
    }
    this._id = value;
  }

  get jobType(): JobType {
    return this._jobType;
  }

  private set jobType(value: JobType) {
    if (!value) {
      throw new Error('JobType is required');
    }

    this._jobType = value;
  }

  get interval(): number {
    return this._interval;
  }

  private set interval(value: number) {
    this._interval = value;
  }

  get data(): JobData {
    return this._data;
  }

  private set data(value: JobData) {
    if (!value) {
      throw new Error('Data is required');
    }
    this._data = value;
  }
}

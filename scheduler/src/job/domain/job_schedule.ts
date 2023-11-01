import { assignableShardLength } from 'src/master/master.service';

export class ScheduledJob {
  private _id: string;
  private _jobId: string;
  private _nextExecution: number;
  private _shard: number;
  private _queued: boolean;

  constructor(params: {
    id: string;
    jobId: string;
    nextExecution: number;
    shard?: number;
    queued?: boolean;
  }) {
    this.id = params.id;
    this.jobId = params.jobId;
    this.nextExecution = params.nextExecution;
    this.shard =
      params.shard || Math.floor(Math.random() * assignableShardLength) + 1;
    this._queued = params.queued || false;
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

  get jobId(): string {
    return this._jobId;
  }

  private set jobId(value: string) {
    if (!value) {
      throw new Error('JobId is required');
    }
    this._jobId = value;
  }

  get nextExecution(): number {
    return this._nextExecution;
  }

  private set nextExecution(value: number) {
    if (!value) {
      throw new Error('NextExecution is required');
    }
    this._nextExecution = value;
  }

  get shard(): number {
    return this._shard;
  }

  private set shard(value: number) {
    if (!value) {
      throw new Error('Shard is required');
    }
    this._shard = value;
  }

  get queued(): boolean {
    return this._queued;
  }

  private set queued(value: boolean) {
    if (!value) {
      throw new Error('Queued is required');
    }
    this._queued = value;
  }

  public markAsQueued() {
    this.queued = true;
  }
}

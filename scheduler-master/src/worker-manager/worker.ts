export class Worker {
  private _id: string;
  private _lastHeartbeat: Date;
  private _shards: number[];

  constructor(params: { id: string; lastHeartbeat: Date; shards: number[] }) {
    this.id = params.id;
    this.lastHeartbeat = params.lastHeartbeat;
    this.shards = params.shards;
  }

  get id(): string {
    return this._id;
  }

  private set id(value: string) {
    if (!value) {
      throw new Error('Worker ID cannot be null or empty');
    }
    this._id = value;
  }

  get lastHeartbeat(): Date {
    return this._lastHeartbeat;
  }

  private set lastHeartbeat(value: Date) {
    this._lastHeartbeat = value;
  }

  get shards(): number[] {
    let shards = [...this._shards];
    shards = shards.filter((s) => s !== -1);
    return shards;
  }

  private set shards(value: number[]) {
    this._shards = value;
  }

  public addShard(shard: number) {
    this._shards.push(shard);
  }

  public updateShards(shards: number[]) {
    this._shards = shards;
  }

  public updateLastHeartbeat(date: Date) {
    this._lastHeartbeat = date;
  }
}

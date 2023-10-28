import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { catchError, Observable, of } from 'rxjs';

let connected = false;
export let workerId = randomUUID();
console.log('Worker ID: ' + workerId);

@Injectable()
export class TaskService {
  constructor(@Inject('WORKER_MANAGER') private client: ClientProxy) {}
  @Cron('*/10 * * * * *')
  connectToMaster() {
    if (!connected) {
      try {
        const response: Observable<boolean> = this.client.send<boolean>(
          { cmd: 'registerWorker' },
          {
            id: workerId,
          },
        );

        response
          .pipe(
            catchError((err) => {
              console.log(err);
              return of(false);
            }),
          )
          .subscribe((res) => {
            if (res) {
              connected = true;
              console.log('Connected to master!');
            } else {
              console.log('Failed to connect to master!: ' + res);
            }
          });
      } catch (_) {}
    }
  }

  @Cron('*/45 * * * * *')
  sendHeartbeat() {
    if (connected) {
      try {
        const response: Observable<boolean> = this.client.send<boolean>(
          { cmd: 'heartbeat' },
          {
            id: workerId,
          },
        );

        response
          .pipe(
            catchError((err) => {
              console.log(err);
              return of(false);
            }),
          )
          .subscribe((res) => {
            if (res) {
              console.log('Heartbeat sent!');
            } else {
              console.log('Failed to send heartbeat!: ' + res);

              //force reconnect
              connected = false;
            }
          });
      } catch (_) {}
    }
  }
}

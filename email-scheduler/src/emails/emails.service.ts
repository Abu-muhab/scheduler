import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
const sgMail = require('@sendgrid/mail');

@Injectable()
export class EmailsService {
  async scheduleEmail(params: {
    to: string;
    subject: string;
    text: string;
    time: string;
  }): Promise<any> {
    const schedulerUrl = process.env.SCHEDULER_MASTER_URL;

    try {
      const response = await axios.post(`http://${schedulerUrl}:3000/jobs`, {
        jobType: 'one-time',
        scheduledTime: params.time,
        data: {
          name: 'send-email-task',
          data: {
            to: params.to,
            subject: params.subject,
            text: params.text,
          },
        },
      });

      return response.data;
    } catch (err) {
      console.log(err.response.data);
      throw err;
    }
  }

  @RabbitRPC({
    exchange: 'scheduler_execution_exchange',
    routingKey: 'send-email-task',
    queue: 'send-email-execution-queue',
  })
  async sendEmail(rmqmsg: any) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const payload = JSON.parse(rmqmsg);
      const data = payload._data;

      const msg = {
        to: data.to,
        from: 'abumuhab98@gmail.com',
        subject: data.subject,
        text: data.text,
      };

      const response = await sgMail.send(msg);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
}

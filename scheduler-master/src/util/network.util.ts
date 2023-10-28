const { networkInterfaces } = require('os');

export class NetworkUtil {
  static getIpAddress(): string {
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }

    return results['eth0'][0];
  }
}

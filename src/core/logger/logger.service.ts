import fs from 'fs';
import { Config } from '../config/config';

export default class LoggerService {
  
  public interval?: NodeJS.Timeout

  public intervalExecuting = false;

  constructor() {
    this.interval = setInterval(async () => {
      if (this.intervalExecuting) {
        return;
      }
      this.intervalExecuting = true;
      try {
        await this.getCurrentFilename();
      } catch (err) {
        this.write(err);
      } finally {
        this.intervalExecuting = false;
      }
    }, 60000 * 60);
    process.on('uncaughtException', this.exceptionListener.bind(this));
    process.on('unhandledRejection', this.exceptionListener.bind(this) as any);
  }

  public async exceptionListener(error: Error) {
    this.write(error);
    console.error(error);
  }

  public async write(message: string | Error | (string | Error)[], log = 'error') {
    const file = await this.getCurrentFilename(log);
    const date = new Date();
    message = Array.isArray(message) ? message : [message];
    // eslint-disable-next-line no-restricted-syntax
    for (const m of message) {
      let messageForWrite = m instanceof Error ? m.stack : `${m}`;
      messageForWrite = `${`${date.getFullYear()}-`
        + `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T`
        + `${String(date.getHours()).padStart(2, '0')}:`
        + `${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} `}${
        messageForWrite}`;
      fs.appendFileSync(file, `${messageForWrite}\n`);
      console.log(messageForWrite);
    }
  }

  public async getCurrentFilename(log = 'error') {
    if (!fs.existsSync(Config.logdir)) {
      fs.mkdirSync(Config.logdir);
    }
    const fileName = `${Config.logdir}/${log}.log`;
    if (!fs.existsSync(fileName)) {
      return fileName;
    }
    const fd = fs.openSync(fileName, 'r');
    const stat = fs.fstatSync(fd);
    fs.closeSync(fd);
    const date = new Date();
    if (stat.mtime.getDate() !== date.getDate()) {
      let moveFileName = `${Config.logdir}/${log}-${stat.mtime.getFullYear()}-`
        + `${String(stat.mtime.getMonth() + 1).padStart(2, '0')}-${String(stat.mtime.getDate()).padStart(2, '0')}.log`;
      moveFileName = fs.existsSync(moveFileName) ? `${moveFileName}.${Date.now()}` : moveFileName;
      fs.renameSync(fileName, moveFileName);
    }
    return fileName;
  }
}

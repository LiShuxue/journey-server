import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LoggerService, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT }) // 虽然LoggerModule 是全局的，但是 Scope.TRANSIENT 确保我们在每个功能模块中都拥有唯一的实例MyLogger，而不是全局单例
export class MyLoggerService implements LoggerService {
  private logger: Logger;
  private context: string;

  constructor() {
    let transport = [];
    // 生产环境，输出到文件
    if (process.env.NODE_ENV === 'production') {
      transport = [
        new transports.DailyRotateFile({
          // 日志文件文件夹，建议使用path.join()方式来处理，或者process.cwd()来设置，此处仅作示范
          dirname: 'logs',
          // 日志文件名 %DATE% 会自动设置为当前日期
          filename: 'application-%DATE%.info.log',
          // 日期格式
          datePattern: 'YYYY-MM-DD',
          // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
          zippedArchive: true,
          // 文件最大大小，可以是bytes、kb、mb、gb
          maxSize: '10m',
          // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
          maxFiles: '14d',
          // info及以下的日志
          level: 'info',
        }),
        // 同上述方法，区分error日志和info日志，保存在不同文件，方便问题排查
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '14d',
          level: 'error',
        }),
      ];
    } else {
      // 本地运行，输出到控制台
      transport = [new transports.Console()];
    }

    this.logger = createLogger({
      // winston 日志格式定义
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.colorize({ all: true }), // 在控制台输出时有颜色，在文本中记录没颜色，但是可以将文本通过 cat 命令输出到控制台时有颜色区分
        format.printf((info) => `${info.level}: ${info.timestamp}: [${info.context}] ${info.message}`),
      ),
      transports: transport,
    });
  }

  public setContext(context: string): void {
    this.context = context;
  }

  // 基本日志记录
  log(message: any, context?: string): Logger {
    return this.logger.info({
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context: context || this.context,
    });
  }

  warn(message: any, context?: string) {
    return this.logger.warn({
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context: context || this.context,
    });
  }

  error(message: any, context?: string) {
    return this.logger.error({
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context: context || this.context,
    });
  }
}

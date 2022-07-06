import { injectable } from "inversify";

export interface ILoggerService {
  log(message: string, data?: any, className?: string): void;
}

@injectable()
export class LoggerService implements ILoggerService {
  private _output: Function;

  constructor() {
    this._output = console.log;
  }

  log(message: string, data?: any, className?: string): void {
    this.writeLog(message, data, className);
  }

  private writeLog(message: string, data?: any, className?: string): void {
    let dataOutput = data ?? {};
    if (dataOutput instanceof Error) {
      dataOutput = "Error message: " + dataOutput.message + "; Stack: " + dataOutput.stack;
    } else {
      try {
        JSON.stringify(dataOutput);
      } catch (jsonError) {
        dataOutput = "Unable to serialize error data";
      }
    }

    const outObject = {
      message: message,
      data: dataOutput,
      timestamp: new Date().toISOString(),
      location: className
    };

    let outString: string;
    try {
      outString = JSON.stringify(outObject);
    } catch (err) {
      outString = `{"message":"Error trying to serialize for logs; ${err}"}`;
    }

    this._output(outString);
  }
}

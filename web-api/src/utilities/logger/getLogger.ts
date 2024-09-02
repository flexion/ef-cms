import { AsyncLocalStorage } from 'async_hooks';
import { Logger } from 'winston';
import { createLogger } from '@web-api/createLogger';

let loggerCache: LoggerType;

export const getLogger = (): LoggerType => {
  if (!loggerCache) {
    const logger = createLogger();
    const asyncLocalStorage = new AsyncLocalStorage<Record<string, any>>();
    loggerCache = {
      addContext: (newMeta: Record<string, any>) => {
        // logger.defaultMeta = {
        //   ...logger.defaultMeta,
        //   ...newMeta,
        // };
        const currentContext = asyncLocalStorage.getStore();
        asyncLocalStorage.enterWith({
          ...currentContext,
          ...newMeta,
        });
      },
      clearContext: () => {
        logger.defaultMeta = undefined;
      },
      debug: (message, context?) => logger.debug(message, { context }),
      error: (message, context?) => logger.error(message, { context }),
      getContext: () => logger.defaultMeta,
      info: message => logger.info(message, asyncLocalStorage.getStore()),
      warn: (message, context?) => logger.warn(message, { context }),
    };
  }

  return loggerCache;
};

type LoggerType = {
  debug: (message: any, context?: any) => Logger;
  error: (message: any, context?: any) => Logger;
  info: (message: any, context?: any) => Logger;
  warn: (message: any, context?: any) => Logger;
  clearContext: () => void;
  addContext: (newMeta: Record<string, any>) => void;
  getContext: () => Record<string, any>;
};

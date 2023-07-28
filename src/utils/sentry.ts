import * as Sentry from '@sentry/node';
import logger from './logger';

Sentry.init({
  dsn: 'https://c0cc657e1c54459eb8b51d60df18a121@o212666.ingest.sentry.io/1510147',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
});

const addBreadcrumb = (message: string) => {
  logger.info(message);
  Sentry.addBreadcrumb({ message });
};

const captureException = (error: any) => {
  logger.error(error);
  Sentry.captureException(error);
};
export default {
  addBreadcrumb,
  captureException
};

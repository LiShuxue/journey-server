const Sentry = require('@sentry/node');

interface Scope {
  setUser: <T>(arg: T) => void
  setTag: <T, U>(arg1: T, arg2: U) => void
  setExtra: <T, U>(arg1: T, arg2: U) => void
}

type LogLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://c0cc657e1c54459eb8b51d60df18a121@sentry.io/1510147' });
}

const setUserContext = (context: any) => {
  Sentry.configureScope((scope: Scope) => {
    scope.setUser(context);
  })
}

const setTagContext = (key: string, value: string) => {
  Sentry.configureScope((scope: Scope) => {
    scope.setTag(key, value);
  })
}

const setExtraContext = (key: string, obj: any) => {
  Sentry.configureScope((scope: Scope) => {
    scope.setExtra(key, obj);
  })
}

const addBreadcrumb = (message: string, data?: any, category: string = 'breadcrumb', level: LogLevel = 'info') => {
  Sentry.addBreadcrumb({
    message,
    data,
    category: category,
    level: level
  });
}

const captureException = (error: any) => {
  error && Sentry.captureException(error);
}

const captureMessage = (msg: string) => {
  msg && Sentry.captureMessage(msg);
}

export default {
  setUserContext,
  setTagContext,
  setExtraContext,
  addBreadcrumb,
  captureException,
  captureMessage
}

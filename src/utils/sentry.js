const Sentry = require('@sentry/node');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://c0cc657e1c54459eb8b51d60df18a121@sentry.io/1510147' });
}

const setUserContext = (context) => {
  Sentry.configureScope((scope) => {
    scope.setUser(context);
  })
}

const setTagContext = (key, value) => {
  Sentry.configureScope((scope) => {
    scope.setTag(key, value);
  })
}

const setExtraContext = (key, obj) => {
  Sentry.configureScope((scope) => {
    scope.setExtra(key, obj);
  })
}

const addBreadcrumb = (message, data, category, level) => {
  Sentry.addBreadcrumb({
    message,
    data,
    category: category || 'breadcrumb',
    level: level || 'info'
  });
}

const captureException = (error) => {
  error && Sentry.captureException(error);
}

const captureMessage = (msg) => {
  msg && Sentry.captureMessage(msg);
}

module.exports = {
  setUserContext,
  setTagContext,
  setExtraContext,
  addBreadcrumb,
  captureException,
  captureMessage
}

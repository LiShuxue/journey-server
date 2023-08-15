export function logger(req, res, next) {
  console.log(`LoggerMiddleware`);
  next();
}

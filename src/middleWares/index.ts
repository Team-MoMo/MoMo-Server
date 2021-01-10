import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

interface Error {
  syscall: string;
  code: string;
  message: string;
  status: number;
}

export function normalizePort(val: string): any {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

export const handle404Error = (req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
};

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err && err.message });
};

export function onError(port: string, error: Error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

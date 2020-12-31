// import { User } from '../models/Users';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      TOKEN_SECRET_KEY: string;
      // DATABASE
      DATABASE_NAME: string;
      DATABASE_HOST: string;
      DATABASE_DIALECT: string;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
    }
  }
  namespace Express {
    interface Request {
      decoded?: string | object;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

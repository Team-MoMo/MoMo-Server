export interface DecodedInfo {
  userId: number;
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
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
    export interface Request {
      decoded?: DecodedInfo;
    }
  }
}

export {};

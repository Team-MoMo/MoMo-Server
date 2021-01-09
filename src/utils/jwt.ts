import jwt from 'jsonwebtoken';
import randToken from 'rand-token';
import resJson from './res_json';
import responseMessage from './res_message';
import statusCode from './status_code';
import { Response, Request, NextFunction } from 'express';

interface User {
  id: number;
}

const options: object = {
  algorithm: 'HS256',
  expiresIn: '90d',
  issuer: 'momo',
};

const refreshOptions: object = {
  algorithm: 'HS256',
  expiresIn: '90d',
  issuer: 'momo',
};

const crypto = {
  sign: (user: User) => {
    const payload = {
      userId: user.id,
    };
    const result = {
      token: jwt.sign(payload, process.env.TOKEN_SECRET_KEY, options),
      refreshToken: randToken.uid(256),
    };
    return result;
  },
  publish: (payload: object) => {
    // 토큰 발급기 (토큰 재발급 개인화 가능)
    const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, options);
    const refreshToken = jwt.sign(
      {
        refreshToken: payload,
      },
      process.env.TOKEN_SECRET_KEY,
      refreshOptions
    );
    return {
      token,
      refreshToken,
    };
  },
  verify: (token: string) => {
    // 토큰 식별기
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    } catch (err) {
      if (err.message === 'jwt expired') {
        return -3;
      }
      if (err.message === 'invalid token') {
        return -2;
      }
      return -2;
    }
    return decoded;
  },
  refresh: (user: User) => {
    // 토큰 재발급
    const payload = {
      userId: user.id,
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET_KEY, options);
  },
  isLoggedIn: async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(responseMessage.EMPTY_TOKEN));
    }
    const user = crypto.verify(token);

    if (user === -3) {
      return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(responseMessage.EXPIRED_TOKEN));
    }
    if (user === -2) {
      return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(responseMessage.INVALID_TOKEN));
    }
    req.decoded = user;
    next();
  },
};

export default crypto;

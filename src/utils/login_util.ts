import { OAuth2Client } from 'google-auth-library';
import axois from 'axios';
import User from '../models/users_model';

const loginUtil = {
  googleClient: new OAuth2Client(process.env.GOOGLE_CLIENT_ID),
  google: async (token: string) => {
    try {
      const ticket = await loginUtil.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload()!;
      const userid = payload['sub'];
      return userid;
    } catch (err) {
      return null;
    }
  },
  kakao: async (token: string) => {
    try {
      const tokenInfo = await axois({
        method: 'get',
        url: 'https://kapi.kakao.com/v1/user/access_token_info',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return tokenInfo.data.id;
    } catch (err) {
      return null;
    }
  },
  blindPassword: (user: User) => {
    user.password = '';
    user.passwordSalt = '';
    user.tempPassword = '';
  },
};

export default loginUtil;

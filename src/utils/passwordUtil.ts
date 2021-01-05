import User from '../models/users_model';

const passwordUtil = {
  blindPassword: (user: User) => {
    user.password = '';
    user.passwordSalt = '';
    user.tempPassword = '';
  },
};

export default passwordUtil;

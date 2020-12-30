interface AuthUtil {
  successTrue: Function;
  successFalse: Function;
}

const authUtil: AuthUtil = {
  successTrue: (message: string, data: object[] | object): object => {
    return {
      message,
      data,
    };
  },
  successFalse: (message: string): object => {
    return {
      message,
    };
  },
};
export default authUtil;

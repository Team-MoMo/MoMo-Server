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
  successFalse: (message: string, error?: Error): object => {
    return {
      message,
      error: error && error.message,
    };
  },
};

export default authUtil;

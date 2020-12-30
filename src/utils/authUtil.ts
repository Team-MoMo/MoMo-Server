interface AuthUtil {
  successTrue: object;
  successFalse: object;
}

const authUtil: AuthUtil = {
  successTrue: (message: string, data: object[] | object): object => {
    return {
      success: true,
      message,
      data,
    };
  },
  successFalse: (message: string): object => {
    return {
      success: false,
      message,
    };
  },
};
export default authUtil;

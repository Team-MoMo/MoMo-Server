interface ResJson {
  success: Function;
  fail: Function;
}

const resJson: ResJson = {
  success: (message: string, data: object[] | object): object => {
    return {
      message,
      data,
    };
  },
  fail: (message: string, error?: Error): object => {
    return {
      message,
      error: error && error.message,
    };
  },
};

export default resJson;

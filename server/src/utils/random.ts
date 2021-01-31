const getInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getDate = () => {
  const year = getInt(2020, 2020);
  const month = getInt(1, 12);
  const date = getInt(1, 28);
  return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
};

export default { getInt, getDate };

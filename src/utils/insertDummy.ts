import User from '../models/users_model';
import Diary from '../models/diaries_model';
import Sentence from '../models/sentences_model';
import Emotion from '../models/emotions_model';
import Notification from '../models/notifications_model';

interface Models {
  User: typeof User;
  Diary: typeof Diary;
  Sentence: typeof Sentence;
  Emotion: typeof Emotion;
  Notification: typeof Notification;
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const getRandomDate = () => {
  const year = getRandomInt(2020, 2020);
  const month = getRandomInt(1, 12);
  const date = getRandomInt(1, 28);
  return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
};
const insertDummy = async (db: Models) => {
  try {
    const userList = await db.User.bulkCreate(
      Array(10)
        .fill({})
        .map((data: object, index: number) => {
          return {
            email: `test_email_${index}`,
            name: `test_name_${index}`,
            password: `test_password_${index}`,
            passwordSalt: `test_passwordSalt_${index}`,
            // isAlarmSet: null,
            // alarmTime: null,
          };
        })
    );

    const emotionList = await db.Emotion.bulkCreate(
      ['사랑', '행복', '슬픔', '화남', '위로', '권태', '추억', '일상'].map((data) => {
        return { name: data };
      })
    );

    const sentenceList = await db.Sentence.bulkCreate(
      Array(80)
        .fill({})
        .map((data, index) => {
          return {
            contents: `test_contents_${index}`,
            writer: `test_writer_${index}`,
            publisher: `test_publisher_${index}`,
            emotionId: getRandomInt(1, emotionList.length),
          };
        })
    );

    const diaryList = await db.Diary.bulkCreate(
      Array(5000)
        .fill({})
        .map((data, index) => {
          const sentenceId = getRandomInt(1, sentenceList.length);
          return {
            position: getRandomInt(0, 9),
            depth: getRandomInt(0, 6),
            contents: `test_contents_${index}`,
            userId: getRandomInt(1, userList.length),
            sentenceId: sentenceId,
            emotionId: sentenceList[sentenceId]?.emotionId,
            createdAt: getRandomDate(),
          };
        })
    );
    console.log('insertDummy success');
    process.exit();
  } catch (error) {
    console.log('insertDummy failed', error && error.message);
  }
};

export default insertDummy;

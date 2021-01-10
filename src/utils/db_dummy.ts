import User from '../models/users_model';
import Diary from '../models/diaries_model';
import Sentence from '../models/sentences_model';
import Emotion from '../models/emotions_model';
import Notification from '../models/notifications_model';
import { random } from '.';
import EmotionsHaveSentences from '../models/emotions_have_sentences_model';
import UsersRecommendedSentences from '../models/users_recommended_sentences_model';

interface Models {
  User: typeof User;
  Diary: typeof Diary;
  Sentence: typeof Sentence;
  Emotion: typeof Emotion;
  Notification: typeof Notification;
  EmotionsHaveSentences: typeof EmotionsHaveSentences;
  UsersRecommendedSentences: typeof UsersRecommendedSentences;
}

const dbDummy = async (db: Models) => {
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
            bookName: `test_bookName_${index}`,
            publisher: `test_publisher_${index}`,
            emotionId: random.getInt(1, emotionList.length),
          };
        })
    );

    const emotionsHaveSentencesList = await db.EmotionsHaveSentences.bulkCreate(
      Array(80)
        .fill({})
        .map((data, index) => {
          return {
            sentenceId: sentenceList[index % sentenceList.length]?.id,
            emotionId: random.getInt(1, emotionList.length),
          };
        })
    );

    const diaryList = await db.Diary.bulkCreate(
      Array(5000)
        .fill({})
        .map((data, index) => {
          const sentenceId = random.getInt(1, sentenceList.length);
          return {
            position: random.getInt(0, 9),
            depth: random.getInt(0, 6),
            contents: `test_contents_${index}`,
            userId: random.getInt(1, userList.length),
            sentenceId: sentenceId,
            emotionId: random.getInt(1, emotionList.length),
            wroteAt: random.getDate(),
          };
        })
    );

    console.log('insertDummy success');
    process.exit();
  } catch (error) {
    console.log('insertDummy failed', error);
  }
};

export default dbDummy;

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const email = {
  send: async (email: string, tempPassword: string) => {
    return await transporter.sendMail({
      from: `"MOMO" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: '[MOMO] 임시 비밀번호 발급 안내',
      text: `안녕하세요!\n
      책 속의 문장을 통해 깊이 있는 감정 기록을 도와주는 일기 앱, MOMO입니다.\n\n
      아래 임시 비밀번호 8자리로 로그인해주세요.\n
      로그인 후에는 반드시 비밀번호를 변경해주세요!\n\n
      임시 비밀번호\n
      ${tempPassword}\n\n
      MOMO를 사랑해주셔서 진심으로 감사합니다.🌞\n\n
      MOMO 드림`,

      html: `안녕하세요!<br>
      책 속의 문장을 통해 깊이 있는 감정 기록을 도와주는 일기 앱, MOMO입니다.<br><br>
      아래 임시 비밀번호 8자리로 로그인해주세요.<br>
      로그인 후에는 반드시 비밀번호를 변경해주세요!<br><br>
      임시 비밀번호<br>
      <b>${tempPassword}</b><br><br>
      MOMO를 사랑해주셔서 진심으로 감사합니다.🌞<br><br>
      MOMO 드림`,
    });
  },
};

export default email;

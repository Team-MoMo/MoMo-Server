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
      from: `"MoMo" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: '[MoMo] 임시 비밀번호 발급 안내',
      text: tempPassword,
      html: `<b>${tempPassword}</b>`,
    });
  },
};

export default email;

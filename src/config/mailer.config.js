const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = require("../constants/app.constant");

const getMailerConfig = () => {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error(
      "Thiếu cấu hình SMTP. Vui lòng thêm SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM vào file .env",
    );
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  };
};

const sendPasswordResetCodeEmail = async ({ to, code }) => {
  const transporter = nodemailer.createTransport(getMailerConfig());

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Mã xác thực đặt lại mật khẩu",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2f46">
        <h2 style="margin-bottom:12px;color:#003b95">Khôi phục mật khẩu VietStayHub</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản VietStayHub.</p>
        <p>Mã xác thực của bạn là:</p>
        <div style="display:inline-block;margin:12px 0;padding:12px 20px;border-radius:12px;background:#eef4ff;font-size:28px;font-weight:700;letter-spacing:6px;color:#003b95">
          ${code}
        </div>
        <p>Mã có hiệu lực trong 10 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetCodeEmail,
};

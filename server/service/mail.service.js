require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const otpModel = require("../models/otp.model");
const BaseError = require("../errors/base.error");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587, // Portni son formatida olish
      secure: false, // 465 bo‘lsa true
      auth: {
        user: process.env.SMTP_LOGIN, // Eslatma: SMTP_LOGIN yoki SMTP_USER ishlatish kerakligini tekshirib ko‘ring
        pass: process.env.SMTP_PASS, // .env da to‘g‘ri qo‘yilganligini tekshiring
      },
    });
  }

  async sendOtp(to) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000); // 6 xonali OTP
      console.log(`Generated OTP: ${otp}`);

      const hashedOtp = await bcrypt.hash(otp.toString(), 10);
      await otpModel.create({
        email: to,
        otp: hashedOtp,
        expireAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      const mailOptions = {
        from: `"Telegram" <${process.env.SMTP_USER}>`, // From field to‘g‘ri formatda
        to,
        subject: `OTP for verification - ${new Date().toLocaleString()}`,
        html: `<h1>Your OTP is: <b>${otp}</b></h1><p>This code is valid for 5 minutes.</p>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`OTP Email sent: ${info.messageId}`);

      return otp; // Agar saqlash kerak bo‘lsa, frontga qaytarish mumkin
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP");
    }
  }

  async verifyOtp(email, otp) {
    const otpData = await otpModel.find({ email });
    if (!otpData) throw BaseError.BadRequest("Otp not found");
    const currentOtp = otpData[otpData.length - 1];
    if (!currentOtp) throw BaseError.BadRequest("Otp not found");

    if (currentOtp.expireAt < new Date()) {
      throw BaseError.BadRequest("Your otp is expired");
    }

    const isValid = await bcrypt.compare(otp.toString(), currentOtp.otp);
    if (!isValid) throw BaseError.BadRequest("Invalid otp entered");

    await otpModel.deleteMany({ email });
    return true;
  }
}

module.exports = new MailService();

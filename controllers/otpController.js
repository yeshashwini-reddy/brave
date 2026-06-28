import generateOTP from '../utils/generateOTP.js';
import transporter from '../config/mail.js';

// In-memory store: Map of email -> { otp, expiresAt }
const otpStore = new Map();

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format' });
  }

  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store in memory
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    const mailOptions = {
      from: `"Vanitha Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Vanitha Clinic Email Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; padding: 20px; }
            .card { background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; overflow: hidden; }
            .header { background-color: #2563eb; padding: 30px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1e293b; }
            .otp-container { background-color: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #cbd5e1; }
            .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #1d4ed8; font-family: 'Courier New', Courier, monospace; margin: 0; }
            .expiry { font-size: 14px; color: #64748b; text-align: center; margin-top: 10px; }
            .footer { padding: 30px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1>Vanitha Clinic</h1>
              </div>
              <div class="content">
                <div class="greeting">Hello,</div>
                <p>Thank you for choosing Vanitha Clinic. To complete your registration, please verify your email address using the code below:</p>
                <div class="otp-container">
                  <div class="otp-code">${otp}</div>
                  <div class="expiry">This OTP is valid for 5 minutes.</div>
                </div>
                <p style="margin-bottom: 0;">Please do not share this code with anyone. If you did not request this, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                Regards,<br>
                <strong>Vanitha Clinic Team</strong>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ message: 'Email sending failed. Please try again later.' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const storedData = otpStore.get(email.toLowerCase());

  if (!storedData) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ message: 'Expired OTP' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP verified successfully
  otpStore.delete(email.toLowerCase());
  res.status(200).json({ message: 'OTP Verified' });
};

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendSubscriptionEmail = async (email, plan) => {
  try {
    const mailOptions = {
      from: `MindPal <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your ${plan} MindPal Subscription Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6baf;">Welcome to MindPal!</h2>
          <p>Thank you for subscribing to our ${plan} plan.</p>
          <p>You now have access to all ${plan} features on MindPal.</p>
          <p>If you have any questions, please contact our support team at <br/> <strong>Otomexinnovations@gmail.com</strong></p>
          <br/>
          <p>Best regards,</p>
          <p>The MindPal Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`Email error details for ${email}:`, error);
    return false;
  }
};

export const sendResetPassEmail = async (email, resetCode) => {
  try {
    const mailOptions = {
      from: `MindPal <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Password Reset Request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4a6baf;">Password Reset</h2>
          <p>We received a request to reset your MindPal account password.</p>
          <p>Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; border-radius: 4px;">
            ${resetCode}
          </div>
          <p>Enter this code in the password reset form to verify your identity.</p>
          <p style="color: #ff0000; font-size: 14px;">This code will expire in 15 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <br/>
          <p>Best regards,</p>
          <p>The MindPal Team</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">For security reasons, we don't store your password. If you need help, contact us at <a href="mailto:Otomexinnovations@gmail.com">Otomexinnovations@gmail.com</a></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`Reset password email error for ${email}:`, error);
    return false;
  }
};
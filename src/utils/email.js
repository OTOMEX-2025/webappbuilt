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
          <p>If you have any questions, please contact our support team.</p>
          <br/>
          <p>Best regards,</p>
          <p>The MindPal Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true; // Success
  } catch (error) {
    console.error(`Email error details for ${email}:`, error);
    return false; // Failure
  }
};

export default sendSubscriptionEmail;
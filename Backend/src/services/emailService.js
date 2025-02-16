const nodemailer = require("nodemailer");

let transporter = null;

async function initializeTransporter() {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("SMTP transport initialized successfully");
  } catch (error) {
    console.error("Failed to initialize transporter:", error);
    throw error;
  }
}

const sendEmail = async (to, subject, text, html) => {
  try {
    if (!transporter) {
      await initializeTransporter();
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

// Initialize the transporter when the module is loaded
initializeTransporter().catch(console.error);

module.exports = { sendEmail };

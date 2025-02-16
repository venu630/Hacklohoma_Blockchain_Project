const nodemailer = require("nodemailer");

// Initialize transporter as null
let transporter = null;

// Function to initialize the transporter
async function initializeTransporter() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("SMTP_USER:", testAccount.user);
    console.log("SMTP_PASS:", testAccount.pass);
    console.log("SMTP_HOST:", testAccount.smtp.host);
    console.log("SMTP_PORT:", testAccount.smtp.port);

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error("Failed to initialize transporter:", error);
    throw error;
  }
}

const sendEmail = async (to, subject, text, html) => {
  try {
    // Initialize transporter if not already initialized
    if (!transporter) {
      await initializeTransporter();
    }

    const info = await transporter.sendMail({
      from: '"Test Account" <test@example.com>', // Use test account email since we're using ethereal
      to,
      subject,
      text,
      html,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

// Initialize the transporter when the module is loaded
initializeTransporter().catch(console.error);

module.exports = { sendEmail };

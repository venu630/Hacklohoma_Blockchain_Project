const express = require("express");
const router = express.Router();
const { sendEmail } = require("../services/emailService");

router.post("/trigger", async (req, res) => {
  try {
    const {
      beneficiaryName,
      beneficiaryEmail,
      testatorName,
      ethAmount,
      transactionHash,
      saleDeedName,
      saleDeedIPFSHash,
    } = req.body;

    const emailSubject = `Digital Will Notification - ${testatorName}'s Estate`;

    const plainTextContent = `
Dear ${beneficiaryName},

We are reaching out with heartfelt condolences on the passing of ${testatorName}. We understand that this is a difficult time for you and your family, and we extend our deepest sympathies for your loss.

As part of ${testatorName}'s final wishes, we are notifying you that you have been listed as a beneficiary in their digital will. The inheritance distribution has now been executed through our trustless blockchain-based system.

Will Execution Details:
- Testator: ${testatorName}
- Your Inherited Amount: ${ethAmount} ETH
- Transaction ID: ${transactionHash}

Sale Deed Document Access:
In accordance with ${testatorName}'s wishes, you have been granted access to the following legal sale deed(s):
- Sale Deed Document: ${saleDeedName}
- Document Link: https://ipfs.io/ipfs/${saleDeedIPFSHash}

If you have any questions or need assistance, please do not hesitate to reach out.

Once again, our sincere condolences, and we wish you strength and comfort during this time.

Warm regards,
The Smart Will System Team`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Dear,</p>

  <p>We are reaching out with heartfelt condolences on the passing of ${testatorName}. We understand that this is a difficult time for you and your family, and we extend our deepest sympathies for your loss.</p>

  <p>As part of ${testatorName}'s final wishes, we are notifying you that you have been listed as a beneficiary in their digital will. The inheritance distribution has now been executed through our trustless blockchain-based system.</p>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #2c3e50; margin-top: 0;">🏛 Will Execution Details:</h3>
    <ul style="list-style: none; padding-left: 0;">
      <li><strong>Your Inherited Amount:</strong> ${ethAmount} ETH</li>
      <li><strong>Transaction ID:</strong> ${transactionHash}</li>
    </ul>
  </div>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #2c3e50; margin-top: 0;">📜 Sale Deed Document Access:</h3>
    <p>In accordance with ${testatorName}'s wishes, you have been granted access to the following legal sale deed(s):</p>
    <p>
      🔗 <a href="https://ipfs.io/ipfs/${saleDeedIPFSHash}">View Document on IPFS</a>
    </p>
  </div>

  <p>If you have any questions or need assistance, please do not hesitate to reach out.</p>

  <p>Once again, our sincere condolences, and we wish you strength and comfort during this time.</p>

  <p>
    Warm regards,<br>
    <strong>The Smart Will System Team</strong>
  </p>
</body>
</html>`;

    // Send email
    const emailResult = await sendEmail(
      beneficiaryEmail,
      emailSubject,
      plainTextContent,
      htmlContent
    );

    res.json({
      success: true,
      message: "Will notification email sent successfully",
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send will notification email",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { sendEmail } = require("../services/emailService");

router.post("/trigger", async (req, res) => {
  try {
    console.log(req.body); // Log the request body instead of entire request

    // Send email
    await sendEmail(
      "saimadhukarvanam@gmail.com", // Replace with the recipient's email
      "Chiktava Chiktava!!!!!",
      "Plain text version",
      "<h1>Ni Sulli size taggindi</h1><p>Modkar!!!!!!!!!!!</p>"
    );

    res.json({
      name: "Phani",
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to execute task",
      error: error.message,
    });
  }
});

module.exports = router;

const { mailSender } = require("./email");

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (email, otp) => {
  try {
    const subject = "Your OTP for Verification";
    console.log("Sending OTP to:", email);
    const body = `Your OTP for verification is: ${otp}\n. It will expire in 10 minutes.`;

    await mailSender(email, subject, body);
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw new Error("Could not send OTP. Please try again.");
  }
};
 
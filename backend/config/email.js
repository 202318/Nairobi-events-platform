const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "joypraise.mutwiri@strathmore.edu",
    pass: "nbhqxijezqmapsrb",
  },
});

module.exports = transporter;
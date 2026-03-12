import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to HabitMind",
    html: `<h2>Hello ${name}</h2>
<p>Welcome to HabitMind. Start building better habits today!</p>`,
  });
};


export const sendStreakMilestoneEmail = async (email, name, streak) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: `🔥 ${streak} Day Streak! Keep Going!`,
    html: `
      <h2>Amazing Work ${name}! 🚀</h2>
      <p>You have maintained your habit streak for <b>${streak} days</b>.</p>

      <p>Consistency beats motivation. You're proving that every day.</p>

      <p>Keep pushing. Your future self will thank you.</p>

      <br/>

      <p>- HabitMind</p>
    `
  });
};
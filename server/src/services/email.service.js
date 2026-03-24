import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name) => {
  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";

   await transporter.sendMail({
    from: `"HabitMind" <${process.env.EMAIL}>`,
    to: email,
    subject: "You're In! Start Building Better Habits Today🚀",
    html: `
      <div style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
        
        <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:10px; text-align:left;">
          
          <!-- Logo (public URL instead of attachment) -->
          <img src="${appUrl}/Logo.png" alt="HabitMind Logo" style="width:100px; margin-bottom:20px;" />

          <h2 style="color:#111827; margin-bottom:10px;">
            Welcome, ${name} 👋
          </h2>

          <p style="color:#4b5563; font-size:16px; line-height:1.6;">
            You're all set to start building powerful habits and staying consistent every day.
            We are here to help you stay accountable and grow.
          </p>

          <p style="color:#4b5563; font-size:16px; margin-top:10px;">
            - HabitMind
          </p>

          <!-- CTA Button -->
          <a href="${appUrl}"
             style="
               display:inline-block;
               margin-top:24px;
               padding:14px 28px;
               font-size:16px;
               font-weight:600;
               color:#ffffff;
               background-color:#22c55e;
               text-decoration:none;
               border-radius:6px;
             ">
             Track Habit Now
          </a>

          <p style="margin-top:30px; font-size:14px; color:#9ca3af;">
            Stay consistent. Build momentum. 🚀
          </p>

        </div>

      </div>
    `,
  });
};


export const sendStreakMilestoneEmail = async (email, name, streak) => {
  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";

 await transporter.sendMail({
    from: `"HabitMind" <${process.env.EMAIL}>`,
    to: email,
    subject: `🔥 Congrats ${name}! ${streak}-Day Streak Achieved!`,
    html: `
      <div style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:10px; text-align:left;">
          
          <!-- Logo -->
          <img src="${appUrl}/Logo.png" alt="HabitMind Logo" style="width:100px; margin-bottom:20px;" />

          <!-- Heading -->
          <h2 style="color:#111827; margin-bottom:10px;">Amazing Work, ${name}! 🚀</h2>

          <!-- Message -->
          <p style="color:#4b5563; font-size:16px; line-height:1.6;">
            You have maintained your habit streak for <b>${streak} days</b>.
          </p>

          <p style="color:#4b5563; font-size:16px; line-height:1.6;">
            Consistency beats motivation. You're proving it every single day.
          </p>

          <p style="color:#4b5563; font-size:16px; line-height:1.6;">
            Keep pushing — your future self will thank you.
          </p>

          <!-- CTA Button -->
          <a href="${appUrl}" 
             style="
               display:inline-block;
               margin-top:24px;
               padding:14px 28px;
               font-size:16px;
               font-weight:600;
               color:#ffffff;
               background-color:#22c55e;
               text-decoration:none;
               border-radius:6px;
             ">
             Keep It More
          </a>

          <!-- Signature -->
          <p style="margin-top:30px; font-size:14px; color:#9ca3af;">
            - HabitMind
          </p>

        </div>
      </div>
    `,
  });
};
export const registerEmailTemplate = (confirmationLink) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:40px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:40px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

        <h2 style="color:#333;">Welcome 👋</h2>

        <p style="font-size:16px; color:#666; line-height:1.6;">
          Thank you for creating an account.
          Please confirm your email address to activate your account.
        </p>

        <a
          href="${confirmationLink}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:14px 28px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Confirm Email
        </a>

        <p style="margin-top:30px; font-size:14px; color:#888;">
          If you didn't create this account, you can safely ignore this email.
        </p>

        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">

        <p style="font-size:12px; color:#999;">
          This link may expire after a period of time for security reasons.
        </p>

      </div>
    </div>`;
};

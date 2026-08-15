export const restCodeTemplate = (forgetPasswordCode:number|string) => {
  return `
  
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
          <tr>
            <td align="center">
              <h2 style="color:#333;margin-bottom:10px;">
                Reset Your Password
              </h2>

              <p style="color:#666;font-size:16px;line-height:1.6;">
                We received a request to reset your password.
                Use the verification code below to continue.
              </p>

              <div
                style="
                  display:inline-block;
                  margin:30px 0;
                  padding:15px 35px;
                  background:#2563eb;
                  color:#ffffff;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:8px;
                  border-radius:8px;
                "
              >
                ${forgetPasswordCode}
              </div>

              <p style="color:#888;font-size:14px;">
                This code is valid for <strong>10 minutes</strong>.
              </p>

              <p style="color:#888;font-size:14px;">
                If you didn't request a password reset,
                you can safely ignore this email.
              </p>

              <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

              <p style="font-size:13px;color:#999;">
                © 2026 My App. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Randomstring from "randomstring";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { registerEmailTemplate } from "../../utils/sendEmail/partial/registerEmailTemplate.js";
import { restCodeTemplate } from "../../utils/sendEmail/partial/restCodeTemplate.js";
import { sendEmail } from "../../utils/sendEmail/sendEmails.js";
export const registerUser = async (req, res, next) => {
  // get the user data from the request body
  const { username, email, age, gender, phone, password } = req.body;
  // check if the user already exists in the database
  const isUserExist = await User.findOne({ email });
  if (isUserExist)
    return next(new Error("User already exists", { cause: 409 }));
  // hash the password and create a new user in the database
  const passwordHashed = await bcryptjs.hash(
    password,
    parseInt(process.env.SALT_ROUNDS),
  );
  const newUser = await User.create({
    username,
    email,
    age,
    gender,
    phone,
    password: passwordHashed,
  });

  //   create a JWT token for the new user
  const token = jwt.sign(
    { id: newUser._id, email, tokenType: "activateToken" },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
  //   create confirmation link and send it to the user's email
  const confirmationLink = `${process.env.BASE_URL}/api/auth/confirm/${token}`;
  //   send the confirmation link to the user's email

  try {
    await sendEmail({
      to: email,
      subject: "Confirm your email",
      html: registerEmailTemplate(confirmationLink),
    });
  } catch {
    // Phase One: If sending the email fails, delete the user from the database and return an error
    await User.findByIdAndDelete(newUser._id);
    // phase Two: make user re-send the confirmation email by creating a new token and sending it to the user's email
    // console.log(err);
    return next(
      new Error("Failed to send confirmation email please try again", {
        cause: 500,
      }),
    );
  }

  return res
    .status(201)
    .json({ success: true, message: "please check your email" });
};
// activate Account
export const activateAccount = async (req, res, next) => {
  // get the user data from the request body
  const { token } = req.params;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedToken) return next(new Error("Invalid token", { cause: 400 }));
  if (decodedToken.tokenType !== "activateToken")
    return next(new Error("Invalid token type", { cause: 400 }));
  // check if the user already exists in the database
  const isUserExist = await User.findOne({ email: decodedToken.email });
  if (!isUserExist) return next(new Error("User not found", { cause: 404 }));
  // update the user's account status
  await User.findByIdAndUpdate(isUserExist._id, { isConfirmed: true });
  return res
    .status(200)
    .json({ success: true, message: "Account activated successfully" });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new Error("Invalid email or password", { cause: 400 }));
  const passwordMatch = await bcryptjs.compare(password, user.password);
  if (!passwordMatch)
    return next(new Error("Invalid email or password", { cause: 400 }));
  if (!user.isConfirmed)
    return next(
      new Error("Please confirm your email before logging in", { cause: 400 }),
    );

  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1w",
  });
  await Token.create({
    token,
    userId: user._id,
    agent: req.headers["user-agent"],
  });

  return res
    .status(200)
    .json({ success: true, message: "Login successful", token });
};

export const forgotPasswordCode = async (req, res, next) => {
  const { email } = req.params;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) return next(new Error("User not found", { cause: 404 }));
  if (!isUserExist.isConfirmed)
    return next(
      new Error("Please confirm your email before resetting password", {
        cause: 400,
      }),
    );

  const forgetPasswordCode = Randomstring.generate({
    charset: "numeric",
    length: 6,
  });

  isUserExist.forgetPasswordCode = forgetPasswordCode;
  isUserExist.forgetPasswordCodeExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  ); // 10 minutes from now
  await isUserExist.save();

  const sendForgotPasswordCode = await sendEmail({
    to: email,
    subject: "Reset your password",
    html: restCodeTemplate(forgetPasswordCode),
  });
  if (!sendForgotPasswordCode)
    return next(
      new Error("Failed to send reset password code please try again", {
        cause: 500,
      }),
    );
  return res.status(200).json({
    success: true,
    message: "check your email and Reset your password",
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, password, forgetPasswordCode } = req.body;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    return res.status(404).json({ success: false, message: "User not found" });
  if (!isUserExist.isConfirmed)
    return next(
      new Error("Please confirm your email before resetting password", {
        cause: 400,
      }),
    );
  if (
    !isUserExist.forgetPasswordCodeExpiresAt ||
    isUserExist.forgetPasswordCodeExpiresAt < new Date()
  )
    return next(new Error("Reset code has expired", { cause: 400 }));
  if (forgetPasswordCode !== isUserExist.forgetPasswordCode)
    return next(new Error("Invalid reset code", { cause: 400 }));
  if (await bcryptjs.compare(password, isUserExist.password)) {
    return next(
      new Error("New password cannot be the same as the old password", {
        cause: 400,
      }),
    );
  }
  const passwordHashed = await bcryptjs.hash(
    password,
    parseInt(process.env.SALT_ROUNDS),
  );
  isUserExist.password = passwordHashed;
  isUserExist.forgetPasswordCode = null;
  isUserExist.forgetPasswordCodeExpiresAt = null;
  await isUserExist.save();
  await Token.updateMany({ userId: isUserExist._id }, { isValid: false });
  // console.log(token);

  return res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
};

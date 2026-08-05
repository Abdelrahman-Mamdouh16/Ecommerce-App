import { User } from "../../DB/models/user.model.js";

export const updateUserRole = async (req, res, next) => {
  const { role } = req.body;
  const { id } = req.params;
  if (req.user._id.equals(id)) {
    return next(new Error("You cannot change your own role", { cause: 403 }));
  }
  // Implementation for updating user role
  const isExistingUser = await User.findById(id);
  if (!isExistingUser) return next(new Error("User not found", { cause: 404 }));

  if (isExistingUser.role === role) {
    return next(
      new Error("User role is already set to the requested value", {
        cause: 400,
      }),
    );
  }

  isExistingUser.role = role;
  await isExistingUser.save();

  return res
    .status(200)
    .json({ success: true, message: "User role updated successfully" });
};

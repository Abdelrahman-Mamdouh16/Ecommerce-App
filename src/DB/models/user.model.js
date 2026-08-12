import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    forgetPasswordCode: { type: String, default: null },
    forgetPasswordCodeExpiresAt: {
      type: Date,
      default: null,
    },
    profileImg: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dvr3bltmg/image/upload/v1785680174/ecommerceApp/defaultImg/340d0a8eb7896e54a5d25a7f3faa05f3_o67ih3.jpg",
      },
      id: {
        type: String,
        default:
          "ecommerceApp/defaultImg/340d0a8eb7896e54a5d25a7f3faa05f3_o67ih3",
      },
    },
  },
  { timestamps: true },
);

userSchema.pre(
  "save",
  { document: true, query: false  },
  async function () {
    if (!this.isModified("password")) return ;
    const passwordHashed = await bcryptjs.hash(
      this.password,
      parseInt(process.env.SALT_ROUNDS),
    );
    this.password = passwordHashed;
   
  },
);

export const User = model("User", userSchema);

import { Coupon } from "../../DB/models/coupon.model.js";
import voucher_code from "voucher-code-generator";
export const createCoupon = async (req, res, next) => {
  const { name, discount, expiredAt } = req.body;
  if (name) {
    const isCouponExist = await Coupon.findOne({ name });
    if (isCouponExist) {
      return next(new Error("Coupon already exists", { cause: 400 }));
    }
  }
  const [day, month, year] = expiredAt.split("-");

  const expirationDate = new Date(year, month - 1, day); //MM-DD-YYYY
  const code = voucher_code.generate({ length: 5 });
  const newCoupon = await Coupon.create({
    name: name ?? code[0],
    discount,
    expiredAt: expirationDate,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: newCoupon,
  });
};

export const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find();

  return res.status(200).json({
    success: true,
    message: "Coupons retrieved successfully",
    data: coupons,
  });
};

export const getCouponById = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    return next(new Error("Coupon not found", { cause: 404 }));
  }
if (!req.user._id.equals(coupon.createdBy)&& req.user.role !== "admin") {
    return next(
      new Error("Unauthorized to view this coupon", { cause: 403 }),
    );
  }
  return res.status(200).json({
    success: true,
    message: "Coupon retrieved successfully",
    data: coupon,
  });
};

export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const { name, discount, expiredAt } = req.body;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    return next(new Error("Coupon not found", { cause: 404 }));
  }

  if (!req.user._id.equals(coupon.createdBy)) {
    return next(
      new Error("Unauthorized to update this coupon", { cause: 403 }),
    );
  }

  if (name && name !== coupon.name) {
    const isCouponExist = await Coupon.findOne({
      name,
      _id: { $ne: couponId },
    });

    if (isCouponExist) {
      return next(new Error("Coupon already exists", { cause: 400 }));
    }

    coupon.name = name;
  }

  if (discount !== undefined) {
    coupon.discount = discount;
  }

  if (expiredAt) {
    coupon.expiredAt = expiredAt;
  }

  await coupon.save();

  return res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
};

export const deleteCoupon = async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    return next(new Error("Coupon not found", { cause: 404 }));
  }

  if (!req.user._id.equals(coupon.createdBy)) {
    return next(
      new Error("Unauthorized to delete this coupon", { cause: 403 }),
    );
  }

  await coupon.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
};

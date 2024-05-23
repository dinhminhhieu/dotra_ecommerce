const { Schema, model } = require("mongoose");

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "seller",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    payment: {
      type: String,
      default: "unactive",
    },
    shop_info: {
      type: Object,
      default: {},
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

sellerSchema.index({ name: "text" });

module.exports = model("seller", sellerSchema);

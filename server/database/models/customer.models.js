const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    customerInfo: {
      type: Object,
      default: {},
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

customerSchema.index({ name: "text" });

module.exports = model("customer", customerSchema);

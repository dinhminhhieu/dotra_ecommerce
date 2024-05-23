const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    customer_name: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({
  customer_name: "text",
});

module.exports = model("review", reviewSchema);

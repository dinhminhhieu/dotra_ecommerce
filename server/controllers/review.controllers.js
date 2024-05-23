const reviewModel = require("../database/models/review.models");
const orderModel = require("../database/models/order.models");
const productModel = require("../database/models/product.models");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const { errorMessage, successMessage } = require("../config/message.config");
const {
  mongo: { ObjectId },
} = require("mongoose");

class reviewController {
  // Kiểm tra sản phẩm đã được mua chưa
  isProductBought = async (productId, customerId) => {
    const order = await orderModel.find({
      "products._id": productId,
      customerId: customerId,
    });
    if (!order) {
      return false;
    }
    return true;
  };

  // 1. Thêm đánh giá sản phẩm
  add_review = async (req, res) => {
    const { productId, customerId, customer_name, review, rating, avatar } =
      req.body;
    try {
      const isBought = await this.isProductBought(productId, customerId);

      if (!isBought) {
        response(res, httpStatusCode.BadRequest, {
          message_error_review: errorMessage.ADD_REVIEW_FAIL,
        });
      } else {
        const existingReview = await reviewModel.findOne({
          productId,
          customerId,
        });
        if (existingReview) {
          response(res, httpStatusCode.BadRequest, {
            message_error_review: errorMessage.ALREADY_REVIEWED,
          });
        } else {
          const new_review = await reviewModel.create({
            productId: productId,
            customerId: customerId,
            customer_name: customer_name,
            avatar: avatar,
            rating: rating,
            review: review,
          });

          let rating_product = 0;

          const reviews = await reviewModel.find({ productId: productId });

          for (let i = 0; i < reviews.length; i++) {
            rating_product = rating_product + reviews[i].rating;
          }

          let update_product_rating = 0;

          if (reviews.length !== 0) {
            update_product_rating = (rating_product / reviews.length).toFixed(
              1
            );
          }

          await productModel.findByIdAndUpdate(productId, {
            rating: update_product_rating,
          });
          response(res, httpStatusCode.Created, {
            message: successMessage.ADD_REVIEW_SUCCESS,
            data: new_review,
          });
        }
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 2. Lấy review của khách hàng
  get_review = async (req, res) => {
    const { productId } = req.params;
    const { pageNumber } = req.query;
    const limit = 10;
    const skipPage = limit * (pageNumber - 1);

    try {
      const [getRating, getAll, reviews] = await Promise.all([
        reviewModel.aggregate([
          {
            $match: {
              productId: {
                $eq: new ObjectId(productId),
              },
            },
          },
          {
            $group: {
              _id: "$rating",
              count: {
                $sum: 1,
              },
            },
          },
        ]),
        reviewModel.find({ productId }),
        reviewModel
          .find({ productId })
          .skip(skipPage)
          .limit(limit)
          .sort({ createdAt: -1 }),
      ]);

      const rating_review = [5, 4, 3, 2, 1].map((rating) => {
        const ratingData = getRating.find((r) => r._id === rating);
        return {
          rating,
          sum: ratingData ? ratingData.count : 0,
        };
      });

      response(res, httpStatusCode.Ok, {
        rating_review,
        reviews,
        total_review: getAll.length,
      });
    } catch (error) {
      console.error(error);
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };
}

module.exports = new reviewController();

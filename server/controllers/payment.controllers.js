const env = require("../config/env.config");
const response = require("../utils/response");
const httpStatusCode = require("../config/httpStatusCode");
const paymentModel = require("../database/models/payment.models");
const sellerModel = require("../database/models/seller.models");
const sellerOfOrderModel = require("../database/models/sellerOfOrder.models");
const sellerWallet = require("../database/models/sellerWallet.models");
const dotraWallet = require("../database/models/dotraWallet.models");
const orderModel = require("../database/models/order.models");
const withdrawalRequestModel = require("../database/models/withdrawalRequest.models");
const stripe = require("stripe")(
  "sk_test_51PGcpoAJsOUKToQLJFP71JX7fI1YP7Wv1xu1dQteGu1yfwTwO6dlfIdZVGCS8SQPwxggVl3BVHa55tmgjzrpZ5ni00XgCx7Tff"
);
const { v4: uuidv4 } = require("uuid");
const { successMessage, errorMessage } = require("../config/message.config");
const {
  mongo: { ObjectId },
} = require("mongoose");

class paymentController {
  // 1. Tạo tài khoản thanh toán Stripe
  create_stripe_connect_account = async (req, res) => {
    const { id } = req;
    const uuid = uuidv4();
    try {
      const paymentInfo = await paymentModel.findOne({ sellerId: id });
      if (paymentInfo) {
        await paymentModel.deleteOne({ sellerId: id });
        const account = await stripe.accounts.create({
          type: "express",
        });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "http://localhost:3000/refresh",
          return_url: `http://localhost:3000/success?activeCode=${uuid}`,
          type: "account_onboarding",
        });
        await paymentModel.create({
          sellerId: id,
          accountId: account.id,
          activeCode: uuid,
        });
        response(res, httpStatusCode.Created, { url: accountLink.url });
      } else {
        const account = await stripe.accounts.create({
          type: "express",
        });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "http://localhost:3000/refresh",
          return_url: `http://localhost:3000/success?activeCode=${uuid}`,
          type: "account_onboarding",
        });
        await paymentModel.create({
          sellerId: id,
          accountId: account.id,
          activeCode: uuid,
        });
        response(res, httpStatusCode.Created, { url: accountLink.url });
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 2. Kích hoạt tài khoản thanh toán Stripe
  activate_stripe_connect_account = async (req, res) => {
    const { activeCode } = req.params;
    const { id } = req;
    try {
      const userInfoPayment = await paymentModel.findOne({
        activeCode: activeCode,
      });
      if (userInfoPayment) {
        await sellerModel.findByIdAndUpdate(id, {
          payment: "active",
        });
        response(res, httpStatusCode.Ok, {
          message: successMessage.ACTIVE_ACCOUNT_PAYMENT_SUCCESS,
        });
      } else {
        response(res, httpStatusCode.NotFound, {
          message: successMessage.ACTIVE_ACCOUNT_PAYMENT_FAIL,
        });
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 3. Tạo hóa đơn thanh toán
  create_checkout_session = async (req, res) => {
    const { orderId } = req.body;
    try {
      const order = await orderModel.findById(orderId);

      const line_items = order.products.map((product) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            name: product.product_name,
            images: [product.images[0]],
            description:
              product.quantity +
              " sản phẩm, Giảm giá " +
              product.discount +
              "%",
          },
          unit_amount: Math.round(product.price * (1 - product.discount / 100)),
        },
        quantity: product.quantity,
      }));
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `http://localhost:3001/payment/payment-success`,
        cancel_url: "http://localhost:3001/payment/payment-error",
      });
      res.send({ sessionId: session.id });
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 4. Cập nhật hóa đơn thanh toán
  update_payment = async (req, res) => {
    const { orderId } = req.params;
    try {
      await orderModel.findByIdAndUpdate(orderId, {
        payment_status: "paid",
      });

      await sellerOfOrderModel.updateMany(
        {
          orderId: new ObjectId(orderId),
        },
        {
          $set: { payment_status: "paid" },
        }
      );
      const order = await orderModel.findById(orderId);
      const sellerOfOrder = await sellerOfOrderModel.find({
        orderId: new ObjectId(orderId),
      });
      await dotraWallet.create({
        amount: order.price,
      });
      for (let i = 0; i < sellerOfOrder.length; i++) {
        await sellerWallet.create({
          sellerId: sellerOfOrder[i].sellerId,
          amount: sellerOfOrder[i].price,
        });
      }
      await response(res, httpStatusCode.Ok, {
        message: successMessage.UPDATE_PAYMENT_SUCCESS,
      });
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  sumAmount = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum = sum + data[i].amount;
    }
    return sum;
  };

  // 5. Thống kê tài sản seller
  seller_request_revenue = async (req, res) => {
    const { sellerId } = req.params;
    try {
      const sellerWalletInfo = await sellerWallet.find({ sellerId: sellerId });

      const pendingWithdrawalRequest = await withdrawalRequestModel.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "pending",
            },
          },
        ],
      });

      const successWithdrawalRequest = await withdrawalRequestModel.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "success",
            },
          },
        ],
      });

      const pendingAmount = this.sumAmount(pendingWithdrawalRequest);
      const successAmount = this.sumAmount(successWithdrawalRequest);
      const totalAmount = this.sumAmount(sellerWalletInfo);

      let availableAmount = 0;
      if (totalAmount > 0) {
        availableAmount = totalAmount - (pendingAmount + successAmount);
      }
      response(res, httpStatusCode.Ok, {
        pendingWithdrawalRequest,
        successWithdrawalRequest,
        pendingAmount,
        successAmount,
        totalAmount,
        availableAmount,
      });
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 6. Gửi yêu cầu rút tiền
  send_request_withdrawal = async (req, res) => {
    const { sellerId, amount } = req.body;
    try {
      const sellerWalletInfo = await sellerWallet.find({ sellerId: sellerId });
      const totalAmount = this.sumAmount(sellerWalletInfo);
      if (totalAmount >= amount) {
        const sellerWithdrawlRequest = await withdrawalRequestModel.create({
          sellerId: sellerId,
          amount: parseInt(amount),
        });
        response(res, httpStatusCode.Created, {
          message: successMessage.SEND_REQUEST_WITHDRAWAL_SUCCESS,
          data: sellerWithdrawlRequest,
        });
      } else {
        response(res, httpStatusCode.BadRequest, {
          message: errorMessage.SEND_REQUEST_WITHDRAWAL_FAIL,
        });
      }
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 7. Admin nhận yêu cầu rút tiền
  admin_receive_withdrawal_request = async (req, res) => {
    try {
      const pendingWithdrawalRequest = await withdrawalRequestModel.find({
        status: "pending",
      });
      response(res, httpStatusCode.Ok, {
        pendingWithdrawalRequest,
      });
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };

  // 8. Xác nhận yêu cầu rút tiền
  confirm_withdrawal_request = async (req, res) => {
    const { withdrawalRequestId } = req.params;
    try {
      const withdrawalRequest = await withdrawalRequestModel.findById(
        withdrawalRequestId
      );

      console.log(withdrawalRequest.sellerId);

      const payment = await paymentModel.findOne({
        sellerId: new ObjectId(withdrawalRequest.sellerId),
      });

      console.log(payment);

      // await stripe.transfers.create({
      //   amount: withdrawalRequest.amount,
      //   currency: "vnd",
      //   destination: payment.accountId,
      // });

      await withdrawalRequestModel.findByIdAndUpdate(withdrawalRequestId, {
        status: "success",
      });

      const updateWithdrawalRequest = await withdrawalRequestModel.findById(
        withdrawalRequestId
      );
      response(res, httpStatusCode.Ok, {
        message: successMessage.CONFIRM_WITHDRAWAL_REQUEST_SUCCESS,
        data: updateWithdrawalRequest,
      });
    } catch (error) {
      response(res, httpStatusCode.InternalServerError, {
        message: error.message,
      });
    }
  };
}

module.exports = new paymentController();

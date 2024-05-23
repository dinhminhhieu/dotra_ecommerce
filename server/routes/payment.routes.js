const paymentControllers = require("../controllers/payment.controllers");
const authMiddlewares = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get(
  "/create-stripe-connect-account",
  authMiddlewares,
  paymentControllers.create_stripe_connect_account
);

router.put(
  "/activate-stripe-connect-account/:activeCode",
  authMiddlewares,
  paymentControllers.activate_stripe_connect_account
);

router.post(
  "/create-checkout-session",
  paymentControllers.create_checkout_session
);

router.put("/update-payment/:orderId", paymentControllers.update_payment);

router.get(
  "/seller-request-revenue/:sellerId",
  authMiddlewares,
  paymentControllers.seller_request_revenue
);

router.post(
  "/send-request-withdrawal",
  authMiddlewares,
  paymentControllers.send_request_withdrawal
);

router.get(
  "/admin-receive-withdrawal-request",
  authMiddlewares,
  paymentControllers.admin_receive_withdrawal_request
);

router.post(
  "/confirm-withdrawal-request/:withdrawalRequestId",
  authMiddlewares,
  paymentControllers.confirm_withdrawal_request
);

module.exports = router;

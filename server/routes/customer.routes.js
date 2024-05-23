const customerControllers = require("../controllers/customer.controllers");
const router = require("express").Router();

router.post("/customer-register", customerControllers.customer_register);

router.post(
  "/verify-email-customer/:email_token",
  customerControllers.verify_email
);

router.post("/customer-login", customerControllers.customer_login);

router.get("/oauth/google", customerControllers.oauth_google);

router.get("/customer-logout", customerControllers.customer_logout);

module.exports = router;

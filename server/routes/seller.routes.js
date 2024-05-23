const sellerController = require("../controllers/sellerController");
const authMiddlewares = require("../middlewares/auth.middlewares");
const router = require("express").Router();

router.get(
  "/get-seller-request",
  authMiddlewares,
  sellerController.get_seller_request
);

router.get(
  "/get-seller-details/:sellerId",
  authMiddlewares,
  sellerController.get_seller_details
);

router.put(
  "/seller-update-status",
  authMiddlewares,
  sellerController.seller_update_status
);

router.get(
  "/get-seller-active",
  authMiddlewares,
  sellerController.get_seller_active
);

router.get(
  "/get-seller-deactive",
  authMiddlewares,
  sellerController.get_seller_deactive
);

module.exports = router;

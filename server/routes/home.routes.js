const homeComtrollers = require("../controllers/home.controllers");
const router = require("express").Router();

router.get("/get-categories", homeComtrollers.get_categories);

router.get("/get-feature-products", homeComtrollers.get_feature_products);

router.get("/query-products", homeComtrollers.query_products);

router.get(
  "/get-product-details/:productId",
  homeComtrollers.get_product_details
);

module.exports = router;

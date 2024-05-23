const router = require("express").Router();
const cartControllers = require("../controllers/cart.controllers");

router.post("/add-to-cart", cartControllers.add_to_cart);

router.get("/get-cart/:customerId", cartControllers.get_cart);

router.delete(
  "/delete-product-cart/:cartId",
  cartControllers.delete_product_cart
);

router.put("/increase-quantity/:cartId", cartControllers.increase_quantity);

router.put("/decrease-quantity/:cartId", cartControllers.decrease_quantity);

router.post("/apply-coupons", cartControllers.apply_coupons);

module.exports = router;

const reviewControllers = require("../controllers/review.controllers");

const router = require("express").Router();

router.post("/add-review", reviewControllers.add_review);

router.get("/get-review/:productId", reviewControllers.get_review);

module.exports = router;

const express = require("express");
const productController = require("../controller/product.controller");
const auth = require("../middleware/auth.middleware"); // <-- IMPORTANT

const router = express.Router();

// Protect all product routes
router.post("/add", auth, productController.addProduct);
router.get("/get", auth, productController.getProducts);
router.put("/update/:id", auth, productController.updateProduct);
router.delete("/delete/:id", auth, productController.deleteProduct);

module.exports = router;

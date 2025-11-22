const express = require("express");
const productController = require("../controller/product.controller");

const router = express.Router();


router.post("/add", productController.addProduct);
router.get("/get", productController.getProducts);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.patch("/update-stock/:id", productController.updateStock);

module.exports = router;
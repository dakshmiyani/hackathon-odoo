const express = require("express")
const productController = require("../controller/product.controller");


const router = express.Router();

// Protect all product routes
router.post("/add",  productController.addProduct);
router.get("/get",  productController.getProducts);
router.put("/update/:id",  productController.updateProduct);
router.delete("/delete/:id",  productController.deleteProduct);

module.exports = router;

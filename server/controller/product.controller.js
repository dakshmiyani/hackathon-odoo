const Product = require("../models/product.model");

// ----------------------- ADD PRODUCT -----------------------
const addProduct = async (req, res) => {
  try {
    const { productName, sku, category, unit, perUnitCost, stock, freeToUse, lowStockLevel } = req.body;

    // SKU must be unique
    const existingSKU = await Product.findOne({ sku });
    if (existingSKU) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await Product.create({
      productName,
      sku,
      category,
      unit,
      perUnitCost,
      stock,
      freeToUse,
      lowStockLevel
    });

    return res.status(201).json(product);

  } catch (error) {
    console.log("Add product error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ----------------------- GET ALL PRODUCTS -----------------------
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);

  } catch (error) {
    console.log("Get products error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ----------------------- UPDATE PRODUCT -----------------------
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updated);

  } catch (error) {
    console.log("Update product error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ----------------------- DELETE PRODUCT -----------------------
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted" });

  } catch (error) {
    console.log("Delete product error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  
};
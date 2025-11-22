const mongoose = require("mongoose");



const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    unit: {
      type: String,
      required: true,
      trim: true // ex: units, kg, cans, pieces
    },

    perUnitCost: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    freeToUse: {
      type: Number,
      required: true,
      default: 0
    },

    lowStockLevel: {
      type: Number,
      default: 5 // default threshold
    }
    ,
      createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }           
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

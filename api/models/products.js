//Basically defines how our product should look like in the application
const mongoose = require("mongoose");

//create schema
const productSchema = mongoose.Schema({
  //serial id , a long string
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);

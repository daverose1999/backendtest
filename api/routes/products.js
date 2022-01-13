const express = require("express");
//express router
//sub package the express framework ships
//with that gives us different capabilities
//to conveniently handle different routes reaching diferent endpoints
//with different http words
const router = express.Router();

//use router to initialize different routes
//next is used so the move request to next middleware
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products",
  });
});

//handling post requests to this route
router.post("/", (req, res, next) => {
  //create new product as javascript object
  const product = {
    //extract property from incoming request
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  };
  res.status(200).json({
    message: "Handling POST requests to /products",
    //To confirm Product is created and parse the object propert in it
    createdProduct: product,
  });
});

//get information about a product/item
//a variable segment is required to go to /products/productID
router.get("/:productId", (req, res, next) => {
  //extract productID
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: "You discovered the special ID",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
    });
  }
});

//to update product
router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Updated product!",
  });
});

//to update product
router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Deleted product!",
  });
});

//to export to other parts of the code , e.g app.js file
//so they are imported and assigned
module.exports = router;

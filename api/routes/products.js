const express = require("express");
/*express router sub package the express framework ships with that gives us different capabilities to conveniently handle different routes reaching diferent endpoints with different http words*/
const router = express.Router();
const mongoose = require("mongoose");

const multer = require("multer");
//to only store certain types
const storage = multer.diskStorage({
  //where the file is to be stored
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  //file should be named
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//pass data to multer configuration object and filter file size
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //files up to 5mb
  },
  //call the filter constant above
  fileFilter: fileFilter,
});

const Product = require("../models/products");

//use router to initialize different routes next is used so the move request to next middleware
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id quantity productImage") //define fields to selects
    .exec()
    .then((docs) => {
      //return all products

      //gives meta data of the amount of elements fetched
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          //map into a new array to get individual doc and fetch the new version of it
          return {
            name: doc.name,
            price: doc.price,
            quantity: doc.quantity,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//handling post requests to this route
router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  //use instance of the model to store data
  const product = new Product({
    //extract property from incoming request
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    productImage: req.file.path,
  });

  //this is used to store in the database,
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product sucessfully",
        //To confirm Product is created and parse the object propert in it
        createdProduct: {
          name: result.name,
          price: result.price,
          quantity: result.quantity,
          productImage: result.productImage,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get information about a product/item a variable segment is required to go to /products/productID
router.get("/:productId", (req, res, next) => {
  //extract productID
  const id = req.params.productId;
  Product.findById(id)
    .select("name price quantity _id productImage")
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      {
        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: "GET",
              description: "Get all products",
              url: "http://localhost:3000/products",
            },
          });
        } else {
          res.status(404).json({
            message: "No Valid entry found for provided ID",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//to update product
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOPs = {};
  //loop through all opreations of request body which is an array
  for (const ops of req.body) {
    updateOPs[ops.propName] = ops.value;
  }
  Product.updateOne(
    { _id: id },
    {
      $set: updateOPs,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//to delete product
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: {
            name: "String",
            Price: "Number",
            Quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//to export to other parts of the code , e.g app.js file
//so they are imported and assigned
module.exports = router;

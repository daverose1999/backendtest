const express = require("express");
/*express router sub package the express framework ships with that gives us different capabilities to conveniently handle different routes reaching diferent endpoints with different http words*/
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

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

//use router to initialize different routes next is used so the move request to next middleware
//we will not use jwt for this route because it needs to be accessible to customers and employess alike
router.get("/", ProductsController.products_get_all);

//handling post requests to this route
//needs authentication
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_products
);

//get information about a product/item a variable segment is required to go to /products/productID
//same goes for this , no jwt
router.get("/:productId", ProductsController.products_get_product);

//to update product
router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

//to delete product
router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_product
);

//to export to other parts of the code , e.g app.js file
//so they are imported and assigned
module.exports = router;

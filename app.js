//This file is spinning up this application which makes handling requests easilier

//This spins up the express application which uses all kinds of utilities methods
const express = require("express");
const app = express();
//Logger middleware tells express to funnel all request through this middleware this will eventually call the next function below to continue process
const morgan = require("morgan");
const bodyParser = require("body-parser");
//SETUP connetion
const mongoose = require("mongoose");
//requests are forwarded to this file if the url targeted is /products
const productRoutes = require("./api/routes/products");

mongoose.connect(
  "mongodb+srv://daverose1999:" +
    //TO ACCESS PASSWORD and set it on server you deploy to so you don't have to hard code it
    process.env.MONGO_ATLAS_PW +
    "@backend-test.p7n6k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  //it will use the mongodbclient for connecting espiceially for mongoose
);
//
mongoose.Promise = global.Promise;

//sets up a middleware so an incoming request has to go through app.use and do whatever parameter is passed through it
app.use(morgan("dev"));

//makes uploads available to everyone
app.use("/uploads", express.static("uploads"));

//apply body parser to incoming request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling CORS Errors, we may never encouter them on POSTMAN because it is a testing tool append headers to response sent back
app.use((req, res, next) => {
  //adjust to send these headers where * gives access to any origin
  res.header("Access-Control-Allow-Origin", "*");
  //To define the headers we want to accept
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  );
  //if the incoming request is equal to OPTIONS
  if (req.method === "OPTIONS") {
    //ALSO tell the browser what to send
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    //Also want to return a response
    return res.status(200).json({});
  }
  next();
});

//every request is a funnelled through, therefore only requests that start with /products, will be handled by handlers parsed as argument ie  ProductRoutes
app.use("/products", productRoutes);

//catch all requests that make it past the middlewares
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  //Parse error along with it to forward the error request
  next(error);
});

//Handles errors thrown from the error created above to errors thrown from anywhere in the application
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

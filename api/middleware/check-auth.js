/* To make sure, bot all routes are accesible, a good practice is to add a middleware which can easilty be add to a given route, that run prior to the route, gets processed and determine whether to continue or not
So it check for a valid token, only if this is true it can conitnue  */

const jwt = require("jsonwebtoken");
require("dotenv").config();

//default middle pattern
module.exports = (req, res, next) => {
  //the verified method will return decoded token
  try {
    //now we get token from header
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);

    const decoded = jwt.verify(token, "" + process.env.JWT_KEY); //this is a guaranteed way to fail unless jwt is added to route //for auth success
    //extract decoded user data on this field
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};

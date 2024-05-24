const jwt = require("jsonwebtoken");
// const userModel = require("../modules/users/model");
const constant = require("../utilities/constants");
const { customResponse } = require("../utilities/helper");
const constants = require("../utilities/constants");
const pool = require("./../Database/db")
const verifyToken = async (req, res, next) => {
  let code, message;
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
    // console.log(token);
    // console.log("=============........===========");
    let val = jwt.verify(token, "secret");
    const userDoc = await pool.query('SELECT * FROM users WHERE username = $1', [val["username"]]);
    // console.log("calll==============",val, "val",userDoc.rows);
    
    req["userId"] = userDoc.rows["0"].id
    

    if (val) {
      next();
    } else {
      res.json({
        error: `You are not autherised to view this`,
      });
    }
  }
  else {
    code = constants.HTTP_401_CODE;
    message = "No access token found";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

const verifyTokenAndAuthorize = (roles = []) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (typeof roles === "string") {
        roles = [roles];
      }
      if (
       true
      ) {
        next();
      } else {
        res.status(constants.HTTP_403_CODE).json({
          status: constants.HTTP_403_CODE,
          success: false,
          message: "constants.FORBIDDEN_MSG",
        });
      }
    });
  };
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorize,
};

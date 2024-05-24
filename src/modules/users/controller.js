const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../utilities/constants");
const { customResponse } = require("../../utilities/helper");
const pool = require("./../../Database/db")




// To register/add user
const registerUser = async (req, res) => {

  let code, message, data;
  let success = false;
  try {
    let { firstName, lastName, email, roles,username, password } =
      req.body;
    email = email.toLowerCase();

    const results = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
    if (results && results.rows.length > 0) {
      alreadyPresent = true;
      throw { message: "user already present" };
    }
  
    if (!roles){
      roles="parent"

    }
    // if (roles.includes("admin")) {
    //   roles = roles.filter((role) => role != "admin");
    // }
    
    let has_password = await bcrypt.hash(password, 10)
    roles =  JSON.stringify(roles)
    const query = {
      text: 'INSERT INTO users (first_name, last_name, email, roles, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [firstName, lastName, email, roles, username, has_password],
    };
    var newUser 
    const registreUser = await pool.query(query)

    code = constants.HTTP_201_CODE;
    
   
    return res.status(code).send(registreUser.rows);
  }catch (error) {

    console.log("error in post register user endpoint", error);
    code = error?.code ? error.code : constants.HTTP_400_CODE;
    message = error?.message ? error.message : constants.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(400).send(resData);
  }
};

// login
const login = async (req, res) => {
  
  let code, message, data;
  let success = false;
  try {
    const username = req.body.username;
    const password = req.body.password;
    
    // const userDoc = await userModel.findOne({
    //   $or: [{ email: username }, { username: username }],
    // });
    const userDoc = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (!userDoc.rows) {
      code = constants.HTTP_401_CODE;
      message = "Invalid Credentials";
      success = false;
      const resData = customResponse({
        code,
        message,
        success,
      });
      return res.status(code).send(resData);
    }
    console.log(userDoc.rows[0].password,"===")
    const isMatch = await bcrypt.compare(password, userDoc.rows[0].password);
    console.log(isMatch,"==ismatch")
    const secret = process.env.JWT_SECRET || "secret";
    const options = {
      expiresIn:  "1d",
      issuer: process.env.ISSUER || "anivesh",
    };
    console.log(username);
    const accessToken = jwt.sign({
      username: username,
    }, secret, options);
  
    data = {
      username: req.body.username,
      roles:userDoc.rows[0]["roles"],
      tokens: { accessToken: accessToken },
    };
    if (isMatch) {
      code = constants.HTTP_201_CODE;
      message = "logged in successfully";
      // data = userDoc;
      return res.status(code).send({ code, message, data });
    } else {
      code = constants.HTTP_400_CODE;
      message = "Invalid Credentials";
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
  } catch (error) {
    console.log("error in post login endpoint", error);
    code = constants.HTTP_400_CODE;
    message = constants.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

const logout = async (req, res) => {
  
  if (req.user) {
    req.logout();
    res.send({ msg: "logging out" });
  } else {
    res.send({ msg: "no user to log out" });
  }
  };


module.exports = {
  registerUser,
  login,
  logout
};

const UserModel = require("../models/user");
const User = require("../models/user");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var UserController = function () {
  this.insertUser = (data) => {
    return new Promise((resolve, reject) => {
      var hashPassword = bcrypt.hashSync(data.password, 10);

      const user = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,

        password: hashPassword,
      });

      user
        .save()
        .then((user) => {
          const token = jwt.sign(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              // expiresIn: 86400, // expires in 24 hours
            }
          );
          resolve(token);
        })
        .catch((err) => {
          reject({ status: 500, message: "Error : " + err });
        });
    });
  };

  this.finduser = (data) => {
    return new Promise((resolve, reject) => {
      User.findOne(data).then((user) => {
        resolve(user);
      });
    });
  };

  this.checklogin = (data) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: data.email })
        .then((user) => {
          if (!user)
            return reject({
              status: 400,
              message: "invalid email please sign up",
            });

          //password is correct
          const validPass = bcrypt.compareSync(data.password, user.password);
          console.log(validPass);
          if (!validPass)
            return reject({ status: 400, message: "invalid password" });

          // resolve({ status: 200, message: "Successfully logged in " })
          //create and assign a token
          const token = jwt.sign(
            {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              // expiresIn: 86400, // expires in 24 hours
            }
          );
          console.log(token);
          resolve({ headers: { "auth-xyder": token }, token });
        })
        .catch((err) => {
          reject({ status: 500, message: "Error : " + err });
        });
    });
  };
};

module.exports = new UserController();

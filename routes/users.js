var express = require("express");
var router = express.Router();
const User = require("../models/user");
const UserController = require("../controllers/user.controller");
var verify = require("./verifyToken");

router.post("/user/login", (req, res, next) => {
  UserController.checklogin(req.body)
    .then((user) => {
      // res.send(JSON.stringify({ "status": user.status, "message": user.message }))
      res.header(user.headers).send(user.token);
    })
    .catch(next);
});

// get unique user by giving email
router.get("/:email", verify, (req, res, next) => {
  UserController.finduser({ email: req.params.email }).then((data) => {
    if (!data) {
      res.send("Dont have a user for this mail");
    } else {
      res.send(data);
    }
  });
});

// add a new user to the client side
router.post("/user/register", (req, res, next) => {
  UserController.insertUser(req.body)
    .then((response) => {
      res.header(response).send(response);
    })
    .catch(next);
});

module.exports = router;

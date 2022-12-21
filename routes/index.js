var express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    title: "Login",
    message: req.flash("message"),
    success_message: req.flash("success_message"),
  });
});

router.post("/login", userController.login);

router.get("/signed-in", (req, res, next) => {
  res.json(req.session.user);
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;

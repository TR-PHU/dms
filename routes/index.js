var express = require("express");
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares");
const customerController = require("../controllers/customerController");
const employeeController = require("../controllers/employeeController");
var router = express.Router();

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    title: "Login",
    message: req.flash("message"),
    success_message: req.flash("success_message"),
  });
});

router.post("/login", userController.login);

/* GET home page. */
router.get("/", isAuthenticated, function (req, res, next) {
  res.render("index", { title: "Dashboard", user: req.session.user });
});

router
  .get("/customer/:id", isAuthenticated, customerController.getCustomerById)
  .get("/customer", isAuthenticated, customerController.index)
  .post("/customer", isAuthenticated, customerController.create)
  .post("/customer/update/:id", isAuthenticated, customerController.update)
  .get("/customer/delete/:id", isAuthenticated, customerController.delete);

router
  .get("/employee/:id", isAuthenticated, employeeController.getEmployeeById)
  .get("/employee", isAuthenticated, employeeController.index)
  .post("/employee", isAuthenticated, employeeController.create)
  .post("/employee/update/:id", isAuthenticated, employeeController.update)
  .get("/employee/delete/:id", isAuthenticated, employeeController.delete);

module.exports = router;

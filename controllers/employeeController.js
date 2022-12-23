const { driver, config } = require("../models/connectDB");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  getEmployeeById: async (req, res, next) => {
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE "ID" = '${req.params.id}'`
      );
      const rows = await results.getRows();
      rows[0].DOB = moment(rows[0].DOB).format("YYYY-MM-DD");

      res.render("employee/edit", {
        title: "Employee employee",
        user: req.session.user,
        employee: rows[0],
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  index: async (req, res, next) => {
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(`SELECT * FROM EMPLOYEE`);
      const rows = await results.getRows();
      rows.forEach((row) => {
        row.DOB = moment(row.DOB).format("DD/MM/YYYY");
        row.updateLink = `/employee/${row.ID}`;
        row.deleteLink = `/employee/delete/${row.ID}`;
      });

      res.render("employee/index", {
        title: "Manage Information Employee",
        user: req.session.user,
        employees: rows,
        message: req.flash("message"),
        success_message: req.flash("success_message"),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res, next) => {
    let {
      username,
      password,
      name,
      gender,
      dateOfBirth,
      phone,
      address,
      salary,
    } = req.body;
    if (
      !username ||
      !password ||
      !name ||
      !gender ||
      !dateOfBirth ||
      !phone ||
      !address ||
      !salary
    ) {
      req.flash("message", "All fields are required");
      return res.redirect("/employee");
    }
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE "USERNAME" = '${username}'`
      );
      const rows = await results.getRows();

      if (rows.length > 0) {
        req.flash("message", "Username already exists");
        return res.redirect("/employee");
      }
      const uuid = uuidv4().split("-")[0];
      dateOfBirth = moment(dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD");
      await connection.execute(
        `INSERT INTO EMPLOYEE("ID","NAME", "USERNAME", "PASSWORD" ,"GENDER", "DOB","ADDRESS" ,"PHONE", "SALARY") VALUES ('${uuid}', '${name}', '${username}', '${password}','${gender}', '${dateOfBirth}', '${address}' ,'${phone}', '${salary}')`
      );

      return res.redirect("/employee");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    let { username, name, gender, dateOfBirth, phone, address, salary } =
      req.body;
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE "ID" = '${id}'`
      );
      const rows = await results.getRows();

      if (rows.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      dateOfBirth = moment(dateOfBirth).format("YYYY-MM-DD");
      await connection.execute(
        `UPDATE EMPLOYEE SET "NAME" = '${name}', "GENDER" = '${gender}', "DOB" = '${dateOfBirth}', "PHONE" = '${phone}', "ADDRESS" = '${address}', "USERNAME" = '${username}', "SALARY" = '${salary}' WHERE "ID" = '${id}'`
      );
      return res.redirect("/employee");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res, next) => {
    const id = req.params.id;
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM EMPLOYEE WHERE "ID" = '${id}'`
      );
      const rows = await results.getRows();

      if (rows.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await connection.execute(
        `DELETE FROM EMPLOYEE WHERE "ID" = '${id}'`
      );
      return res.redirect("/employee");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

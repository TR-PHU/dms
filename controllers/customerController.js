const { driver, config } = require("../models/connectDB");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  getCustomerById: async (req, res, next) => {
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM CUSTOMER WHERE "ID" = '${req.params.id}'`
      );
      const rows = await results.getRows();
      rows[0].DOB = moment(rows[0].DOB).format("YYYY-MM-DD");
      res.render("customer/edit", {
        title: "Edit Customer",
        user: req.session.user,
        customer: rows[0],
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  index: async (req, res, next) => {
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(`SELECT * FROM CUSTOMER`);
      const rows = await results.getRows();
      rows.forEach((row) => {
        row.DOB = moment(row.DOB).format("DD/MM/YYYY");
        row.updateLink = `/customer/${row.ID}`;
        row.deleteLink = `/customer/delete/${row.ID}`;
      });

      res.render("customer/index", {
        title: "Manage Information Customer",
        user: req.session.user,
        customers: rows,
        message: req.flash("message"),
        success_message: req.flash("success_message"),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res, next) => {
    let { name, gender, dateOfBirth, phone, address } = req.body;
    try {
      const connection = await driver.connect(config);
      const uuid = uuidv4().split("-")[0];
      dateOfBirth = moment(dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD");
      await connection.execute(
        `INSERT INTO CUSTOMER("ID","NAME", "GENDER", "DOB", "PHONE", "ADDRESS") VALUES ('${uuid}', '${name}', '${gender}', '${dateOfBirth}', '${phone}', '${address}')`
      );

      return res.redirect("/customer");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    let { name, gender, dateOfBirth, phone, address } = req.body;
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM CUSTOMER WHERE "ID" = '${id}'`
      );
      const rows = await results.getRows();

      if (rows.length === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }

      dateOfBirth = moment(dateOfBirth).format("YYYY-MM-DD");
      await connection.execute(
        `UPDATE CUSTOMER SET "NAME" = '${name}', "GENDER" = '${gender}', "DOB" = '${dateOfBirth}', "PHONE" = '${phone}', "ADDRESS" = '${address}' WHERE "ID" = '${id}'`
      );
      return res.redirect("/customer");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res, next) => {
    const id = req.params.id;
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM CUSTOMER WHERE "ID" = '${id}'`
      );
      const rows = await results.getRows();

      if (rows.length === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }

      await connection.execute(
        `DELETE FROM CUSTOMER WHERE "ID" = '${id}'`
      );
      return res.redirect("/customer");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

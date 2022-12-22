const { driver, config } = require("../models/connectDB");

module.exports = {
  login: async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !username.trim().length) {
      req.flash("message", "Username is required!");
      return res.redirect("/login");
    }

    if (!password || !password.trim().length) {
      req.flash("message", "Password is required!");
      return res.redirect("/login");
    }
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM HOCKEY.EMPLOYEE 
        WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`
      );
      const rows = await results.getRows();
      if (rows.length > 0) {
        req.session.user = rows[0];
        return res.redirect("/");
      }

      req.flash("message", "Invalid username or password");
      return res.redirect("/login");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

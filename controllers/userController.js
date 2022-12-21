const { driver, config } = require("../models/connectDB");

module.exports = {
  login: async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const connection = await driver.connect(config);
      const results = await connection.execute(
        `SELECT * FROM HOCKEY.EMPLOYEE 
        WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`
      );
      const rows = await results.getRows();
      if (rows.length > 0) {
        req.session.user = rows[0];
        return res.redirect("/signed-in");
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

"use strict";

var { Driver } = require(`${process.env.PATH_TO_NODE_NUODB}`);

var config = {
  database: "test",
  hostname: "localhost",
  port: 48004,
  user: "dba",
  password: "dba",
};

var driver = new Driver();

driver.connect(config, function (err, connection) {
  if (err) {
    console.log(err);
  }
  if (connection)
    connection.execute("SELECT * FROM HOCKEY.PLAYERS", function (err, result) {
      result
        .getRows()
        .then((r) => console.log(r))
        .catch((err) => console.log(err));
    });
  else {
    console.log("aaaa");
  }
});

module.exports = {
  driver,
};

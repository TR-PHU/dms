"use strict";

const { Driver } = require(`${process.env.PATH_TO_NODE_NUODB}`);

const config = {
  database: "test",
  hostname: "localhost",
  port: 48004,
  user: "dba",
  password: "dba",
  schema: process.env.NUODB_SCHEMA
};

const driver = new Driver();
var connection;

(async () => {
  connection = await driver.connect(config);
  try {
    if (!connection) {
      throw new Error("Connection failed");
    }

    console.log("Connected to NuoDB successfully");
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    await connection.close();
  }
})().catch((e) => console.log(e.stack));

module.exports = {
  driver,
  config
};

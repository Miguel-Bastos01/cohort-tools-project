require("./db");

const express = require("express");

const app = express();

require("./config")(app);

const cohortsRoutes = require("./routes/cohorts.routes");
const studentsRoutes = require("./routes/students.routes");
const usersRoutes = require("./routes/users.routes");
const { errorHandler, notFoundHandler } = require("./error-handling/index")
app.use("/api", cohortsRoutes, errorHandler,notFoundHandler);
app.use("/api", studentsRoutes, errorHandler,notFoundHandler);
app.use("/api", usersRoutes, errorHandler,notFoundHandler);



module.exports = app;
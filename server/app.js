const express = require("express");
const { PORT } = require("./config/server");
const connectDB = require("./db");
const middleware = require("./middleware");
const cohortsRoutes = require("./routes/cohorts");
const studentsRoutes = require("./routes/students");
const notFound = require("./error-handling/notFound");
const errorHandler = require("./error-handling/errorHandler");

const app = express();

middleware.forEach((mw) => app.use(mw));

connectDB();

app.use("/cohorts", cohortsRoutes);
app.use("/students", studentsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
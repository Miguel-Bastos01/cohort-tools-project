require("dotenv").config()

const express = require("express");
const { PORT } = require("./config/server");
const connectDB = require("./db");
const middleware = require("./middleware");
const authRoutes = require("./routes/auth");
const cohortsRoutes = require("./routes/cohorts");
const studentsRoutes = require("./routes/students");
const usersRoutes = require("./routes/users");
const notFound = require("./error-handling/notFound");
const errorHandler = require("./error-handling/errorHandler");
const { isAuthenticated } = require("./middleware/jwt");

const app = express();

middleware.forEach((mw) => app.use(mw));

connectDB();

app.use("/auth", authRoutes);
app.use("/cohorts", isAuthenticated, cohortsRoutes);
app.use("/students", isAuthenticated, studentsRoutes);
app.use("/users", isAuthenticated, usersRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
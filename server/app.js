const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PORT = 5005;

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

const cohortsSchema = new Schema({
  cohortSlug: String,
  cohortName: String,
  program: String,
  format: String,
  campus: String,
  startDate: Date,
  endDate: Date,
  inProgress: Boolean,
  programManager: String,
  leadTeacher: String,
  totalHours: Number,
});

const Cohort = mongoose.model("Cohort", cohortsSchema);

const studentsSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  linkedinUrl: String,
  languages: [String],
  program: String,
  background: String,
  image: String,
  projects: [],
  cohort: String,
});

const Student = mongoose.model("Student", studentsSchema);

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.json(__dirname + "/views/docs.html");
});

app.get("/cohorts", (req, res) => {
  Cohort.find({})
    .then((responseFromDB) => {
      res.status(200).json(responseFromDB);
    })
    .catch((error) => {
      console.error("error:", error);
      res.status(500).json({ errorMessage: "Internal server error" });
    });
});

app.get("/students", (req, res) => {
  Student.find({})
    .then((DBresp) => {
      res.status(200).json(DBresp);
    })
    .catch((err) => {
      console.error("error:", err);
      res.status(500).json({ errorMessage: "Internal server error" });
    });
});
// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

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
  cohortSlug: {
    type: String,
    required: [true, "cohortSlug required"],
  },
  cohortName: {
    type: String,
    required: [true, "cohortName required"],
  },
  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },
  format: {
    type: String,
    enum: ["Full-Time", "Part-Time"],
  },
  campus: {
    type: String,
    enum: [
      "Madrid",
      "Barcelona",
      "Miami",
      "Paris",
      "Berlin",
      "Amsterdam",
      "Lisbon",
      "Remote",
    ],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  inProgress: {
    type: Boolean,
    default: false,
  },
  programManager: {
    type: String,
    required: [true, "programManager required"],
  },
  leadTeacher: {
    type: String,
    required: [true, "leadTeacher required"],
  },
  totalHours: {
    type: Number,
    default: 360,
  },
});

const Cohort = mongoose.model("Cohort", cohortsSchema);

const studentsSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "firstName required"],
  },
  lastName: {
    type: String,
    required: [true, "lastName required"],
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "phone number required"],
  },
  linkedinUrl: {
    type: String,
    default: "",
  },
  languages: {
    type: String,
    enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"]
  },
  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"]
  },
  background: {
    type: String,
    default: "",
  },
  image:  {
    type: String,
    default: "https://i.imgur.com/r8bo8u7.png",
  },
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

//READ ALL COHORTS - GET - /api/cohorts
app.get("/cohorts", (req, res) => {
  Cohort.find()
    .then((allCohorts) => {
      res.status(200).json(allCohorts);
    })
    .catch((error) => {
      console.error("error:", error);
      res.status(500).json({ errorMessage: "Internal server error" });
    });
});

//CREATE NEW COHORT - POST - /api/cohorts
app.post("/cohorts", (req, res) => {
  const {
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    endDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours,
  } = req.body;

  Cohort.create({
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    endDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours,
  })
    .then((newCohort) => {
      res.status(200).json(newCohort);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "Couldn't create a new cohort - snozzles" });
    });
});

//FIND/READ SPECIFIC COHORT - GET - /api/cohorts/:cohortid
app.get("/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((foundCohort) => {
      res.status(200).json(foundCohort);
    })
    .catch((error) => {
      console.error("error:", error);
      res
        .status(500)
        .json({ errorMessage: "Couldn't find the cohort - my bad" });
    });
});

//UPDATE SPECIFIC COHORT - PUT - /api/cohorts/:cohortid
app.put("/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((error) => {
      console.error("error:", error);
      res
        .status(500)
        .json({ errorMessage: "Couldn't find the cohort - my bad" });
    });
});

//DELETE SPECIFIC COHORT - delete - /api/cohorts/:cohortid
app.delete("/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      console.error("error:", error);
      res
        .status(500)
        .json({ errorMessage: "Couldn't delete the cohort - sorry" });
    });
});

app.post("/students", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinUrl,
    languages,
    program,
    background,
    image,
    projects,
    cohort,
  } = req.body;

  Student.create({
    firstName,
    lastName,
    email,
    phone,
    linkedinUrl,
    languages,
    program,
    background,
    image,
    projects,
    cohort,
  })
    .then((newStudent) => {
      res.status(200).json(newStudent);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "Could not create student" });
    });
});

app.get("/students", (req, res) => {
  Student.find()
    .populate("pupils")
    .then((allStudents) => {
      res.status(200).json(allStudents);
    })
    .catch((err) => {
      console.error("error:", err);
      res.status(500).json({ errorMessage: "Internal server error" });
    });
});

app.get("/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cohortId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Student.findById(cohortId)
    .populate("cohorts")
    .then((foundStudentCohort) => {
      res.status(200).json(foundStudentCohort);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "Could not find cohort of students" });
    });
});

app.get("/students/:studentId", (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Student.findById(studentId)
    .populate("cohorts")
    .then((foundStudent) => {
      console.log(foundStudent);
      res.status(200).json(foundStudent);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "Could not find student" });
    });
});

app.put("/students/:studentId", (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "Could not update student id" });
    });
});

app.delete("/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "Could not delete student id" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

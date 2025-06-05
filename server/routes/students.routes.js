const router = require("express").Router();
const Student = require("../models/Student.model");

// ROUTES - https://expressjs.com/en/starter/basic-routing.html

router.post("/students", (req, res, next) => {
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
    .catch((error) => {
      next(error)
    });
});

router.get("/students", (req, res, next) => {
  Student.find()
    .populate("_id")
    .then((allStudents) => {
      res.status(200).json(allStudents);
    })
    .catch((error) => {
      next(error)
    });
});

router.get("/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cohortId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Student.findById(cohortId)
    .populate("_id")
    .then((foundStudentCohort) => {
      res.status(200).json(foundStudentCohort);
    })
    .catch((error) => {
      next(error)
    });
});

router.get("/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Student.findById(studentId)
    .populate("_id")
    .then((foundStudent) => {
      console.log(foundStudent);
      res.status(200).json(foundStudent);
    })
    .catch((error) => {
      next(error)
    });
});

router.put("/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((error) => {
      next(error)
    });
});

router.delete("/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      next(error)
    });
});

module.exports = router;
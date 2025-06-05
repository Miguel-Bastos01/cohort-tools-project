const router = require("express").Router();
const Cohort = require("../models/Cohort.model");

// ROUTES - https://expressjs.com/en/starter/basic-routing.html

//READ ALL COHORTS - GET - /api/cohorts
router.get("/cohorts", (req, res, next) => {
  Cohort.find()
    .then((allCohorts) => {
      res.status(200).json(allCohorts);
    })
    .catch((error) => {
      next(error)
    });
});

//CREATE NEW COHORT - POST - /api/cohorts
router.post("/cohorts", (req, res, next) => {
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
    .catch((error) => {
      next(error)
    });
});

//FIND/READ SPECIFIC COHORT - GET - /api/cohorts/:cohortid
router.get("/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((foundCohort) => {
      res.status(200).json(foundCohort);
    })
    .catch((error) => {
      next(error)
    });
});

//UPDATE SPECIFIC COHORT - PUT - /api/cohorts/:cohortid
router.put("/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((error) => {
      next(error)
    });
});

//DELETE SPECIFIC COHORT - delete - /api/cohorts/:cohortid
router.delete("/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      next(error)
    });
});

module.exports = router;
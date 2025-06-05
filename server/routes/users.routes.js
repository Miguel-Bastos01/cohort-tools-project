const express = require("express");
const User = require("../models/User.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const router = express.Router();

//FIND/READ SPECIFIC USER - GET - /api/users/:id
router.get("/users/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((foundUser) => {
      console.log(`req.payload`, req.payload);
      res.status(200).json(foundUser);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

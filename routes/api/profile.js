const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../model/user");

router.param("username", function (req, res, next, username) {
  User.findOne({ username: username })
    .then(function (user) {
      if (!user) {
        return res.status(404).json({
          code: 404,
          status: false,
          error: `${username} not found`,
        });
      }
      req.profile = user;
      return next();
    })
    .catch(next);
});

router.get("/:username", auth, function (req, res, next) {
  if (req.user) {
    User.findById(req.user.id).then(function (user) {
      if (!user) {
        return res.status(404).json({
          code: 404,
          status: false,
          error: `user not found`,
        });
      }
      return res.status(200).json({
        status: 200,
        data: req.profile.toProfileJSONFor(user),
      });
    });
  } else {
    return res.status(404).json({
      code: 404,
      status: false,
      error: `user not found`,
    });
  }
});

module.exports = router;

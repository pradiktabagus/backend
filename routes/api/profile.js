const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../model/user");

router.param("username", function (req, res, next, username) {
  User.findOne({ username: username })
    .then(function (user) {
      if (!user) {
        return res.sendStatus(404);
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
          status: 404,
          data: req.profile.toProfileJSONFor(false),
        });
      }
      return res.status(200).json({
        status: 200,
        data: req.profile.toProfileJSONFor(user),
      });
    });
  } else {
    return res
      .status(404)
      .json({ status: 404, data: req.profile.toProfileJSONFor(false) });
  }
});

module.exports = router;

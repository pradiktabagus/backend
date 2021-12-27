const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../model/user");

router.param("username", function (req, res, next, username) {
  console.log(username);
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
  if (req.payload) {
    User.findById(req.user.id).then(function (user) {
      if (!user) {
        return res.json({ profile: req.toProfileJSONFor(false) });
      }
      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
});

module.exports = router;

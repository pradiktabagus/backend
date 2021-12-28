const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Article = require("../../model/Article");
const User = require("../../model/user");

router.param("article", function (req, res, next, slug) {
  //   Article
});

router.post("/", auth, function (req, res, next) {
  User.findById(req.payload.id);
});

module.exports = router;

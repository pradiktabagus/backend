const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Article = require("../../model/Article");

router.param("article", function (req, res, next, slug) {
  //   Article
});

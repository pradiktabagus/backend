const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Article = require("../../model/Article");
const User = require("../../model/user");

router.param("article", function (req, res, next, slug) {
  //   Article
});

router.post("/", auth, function (req, res, next) {
  const { user } = req;
  User.findById(user.id)
    .then(function (user) {
      if (!user) return res.sendStatus(401);
      let article = new Article(req.body);
      article.author = user;
      return article.save().then(function () {
        return res.json({
          status: 200,
          data: article.toJsonFor(user),
        });
      });
    })
    .catch(next);
});

module.exports = router;

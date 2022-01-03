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

router.get("/feeds", auth, function (req, res, next) {
  const { limit, offset } = req.query;
  let lim = limit ? Number(limit) : 20;
  let off = offset ? Number(offset) : 0;

  User.findById(req.user.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      Promise.all([Article.find().limit(lim).skip(off), Article.count()])
        .then(function (result) {
          let article = result[0];
          let totalArticle = result[1];
          return res.json({
            status: 200,
            data: {
              article: article,
              offset: off,
              limit: lim,
              total: totalArticle,
            },
          });
        })
        .catch(next);
    })
    .catch((error) => {
      res.send({ message: "Error in Fetching user" });
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Article = require("../../model/Article");
const User = require("../../model/user");

router.param("article", function (req, res, next, slug) {
  Article.findOne({ slug: slug })
    .then(function (article) {
      if (!article) return res.sendStatus(404);
      req.article = article;

      return next();
    })
    .catch(next);
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
  let lim = limit ? Number(limit) : 10;
  let off = offset ? Number(offset) : 0;
  let skipIdx = (off - 1) * lim;
  User.findById(req.user.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      Promise.all([Article.find().limit(lim).skip(skipIdx), Article.count()])
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

router.get("/:article", auth, function (req, res, next) {
  Promise.all([
    req.user ? User.findById(req.user.id) : null,
    Article.findById(req.article.id),
  ])
    .then(function (result) {
      let user = result[0];
      let article = result[1];
      return res.json({
        status: 200,
        data: article,
      });
    })
    .catch(next);
});

module.exports = router;

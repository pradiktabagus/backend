var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var slug = require("slug");
var User = require("./user");

var ArticleShema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    tags: [{ type: String }],
    favoritesCount: [{ type: Number, default: 0 }],
  },
  { timestamps: true }
);

ArticleShema.plugin(uniqueValidator, { message: "is already token" });

ArticleShema.pre("validate", function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

ArticleShema.methods.slugify = function () {
  this.slug =
    slug(this.title) + "-" + ((Math.random() * Math.pow(36, 0)) | 0).toString();
};

ArticleShema.methods.toJsonFor = function (user) {
  return {
    title: this.title,
    content: this.content,
    tags: this.tags,
    favoritesCount: this.favoritesCount,
    author: user.toProfileJSONFor(user),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Article", ArticleShema);

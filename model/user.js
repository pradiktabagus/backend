var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var secret = require("../config/index").secret;

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "cant't be blank"],
      index: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      unique: true,
    },
    bio: String,
    image: String,
    hash: String,
    salt: String,
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken" });

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

/**
 * @description return json untuk register dan login
 */
UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: this.generateJWT(),
  };
};

UserSchema.methods.errorAuthJSON = function (error) {
  return {
    message: [error],
  };
};

/**
 * @description return json untuk profile user
 */
UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    email: this.email,
    username: this.username,
    bio: this.bio,
    image:
      this.image ||
      "data:image/jpeg;base64,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",
  };
};

module.exports = mongoose.model("User", UserSchema);
// mongoose.model("User", UserSchema);

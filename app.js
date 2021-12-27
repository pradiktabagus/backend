var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var InitiateMongoServer = require("./config/db");
var session = require("express-session");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/api/users");
var profileRouter = require("./routes/api/profile");

const { Error } = require("mongoose");

//initiate mongoo server
InitiateMongoServer();
var app = express();

//cors
var allowedOrigins = ["http://localhost:3002", "https://www.nanali.co"];
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: "Content-Type, token",
    optionsSuccessStatus: 200,
  })
);

//session
app.use(
  session({
    secret: "sabana",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
/**
 * @Router Middleware
 * @Router - /user/*
 * @Method - *
 */
app.use("/api/auth", userRouter);
app.use("/api/profile", profileRouter);

require("./model/user");
require("./config/passport");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    errors: {
      message: err.message,
    },
  });
});

module.exports = app;

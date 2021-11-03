const mongoose = require("mongoose");
const MONGOOURI =
  "mongodb+srv://sabana:diktaBagus95@sabana.mcc5i.gcp.mongodb.net/sabana?retryWrites=true&w=majority";
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Connected to DB !! sabana");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;

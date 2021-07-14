const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

app.listen(process.env.PORT || 3000, function (){
  console.log("server listening on port %d in %s mode", this.address().port, app.settings.env)
})

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/HW18',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
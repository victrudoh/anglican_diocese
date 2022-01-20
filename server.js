const path = require("path");

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const port = process.env.PORT || 4040;

const MONGODB_URI =
  "mongodb+srv://Edikan:pvsantakid@anglican-diocese.rauyb.mongodb.net/anglican_diocese";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.set("view engine", "ejs"); // template engine
app.set("views", path.join(__dirname, "/views")); // setting views directory
app.use(express.static(path.join(__dirname, "/public"))); // static files directory
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

require("./routes/index.routes")(app)

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database connected succesfuly");
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => console.log("connection error: ", err.message));

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    surname: {
      type: String,
      required: "please enter Surname",
    },
    firstName: {
      type: String,
      required: "please enter first name",
    },
    nomenclature: {
      type: String,
      required: "please select nomenclature",
    },
    diocese: {
      type: String,
      required: "please select diocese",
    },
    province: {
      type: String,
      required: "please select province",
    },
    house: {
      type: String,
      required: "please select house",
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: "please enter email address",
      lowercase: true,
      unique: true,
    },
    media: {
      type: String,
    },
    paid: {
      type: String,
      required: true,
      default: "false",
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    // title: {
    //     type: String,
    //     required: "please enter Title",
    // },
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
    laity: {
        type: String,
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
        default: "true",
    },
    role: {
        type: String,
        required: true,
        default: "user",
    },
    attendanceCount: {
        type: Number,
        required: true,
        default: 0,
    },
    accommodation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accommodation",
        required: true,
    }
}, {
    timestamps: true,
});

// module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
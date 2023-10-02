//jshint esversion:6 
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const md5 = require('md5');
const nodemailer = require('nodemailer');
mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.rtis6ak.mongodb.net/herVoiceMattersDB");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const utility = require(__dirname + "/utility.js");

exports.userDetailsRenderOnSignUp = function (data, fileData, cgov, sgov, priv) {
    const userDetails = {
        userPageMessage: "Successfully registerred to the community",
        userName: data.fname + " " + data.lname,
        userEmail: data.email,
        birthDay: data.birthday,
        favPet: data.petname,
        complaintDetails: [cgov, sgov, priv],
        profilePath: "uploads/" + fileData.filename
    }
    return userDetails;
}


exports.userDetailsRenderOnLogIn = function (data, cgov, sgov, priv) {
    const userDetails = {
        userPageMessage: "",
        userName: data.fName + " " + data.lName,
        userEmail: data.eMail,
        birthDay: data.birthDay,
        favPet: data.petName,
        complaintDetails: [cgov, sgov, priv],
        profilePath: "uploads/" + data.DP.filename

    }
    return userDetails
}



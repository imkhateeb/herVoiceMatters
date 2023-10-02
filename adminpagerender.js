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


// start your work from here
exports.adminDetailsRenderOnSignUp = function (data, fileData, cgov, sgov, priv) {
    const adminDetails = {
        userPageMessage: "Successfully registerred to the community",
        adminName: data.fname + " " + data.lname,
        adminEmail: data.email,
        adminState: data.state,
        adminAuthID: data.authid,
        adminDistrict: data.district,
        adminSecretkey: data.seretkey,
        cgovComplaintDetails: cgov,sgovComplaintDetails: sgov,privComplaintDetails: priv,
        cgovComplaintDetail: cgovArray, sgovComplaintDetail: sgovArray, privComplaintDetail: privArray,
        profilePath: "uploads/" + fileData.filename
    }
    return adminDetails;
}


exports.adminDetailsRenderOnLogIn = function (data, cgov, sgov, priv, runningcases) {
    let cgovArray = [];
    let sgovArray = [];
    let privArray = [];
    runningcases.forEach((element) =>{
        if (element.cType == "Cgov" ){
            cgovArray.push(element?.complaintDetails);
        } else if (element.cType == "Sgov" ){
            sgovArray.push(element?.complaintDetails);
        } else {
            privArray.push(element?.complaintDetails);
        }
    })

    // Start fromm here
    const adminDetails = {
        userPageMessage: "",
        adminName: data.fName + " " + data.lName,
        adminEmail: data.eMail,
        adminState: data.State,
        adminAuthID: data.authID,
        adminDistrict: data.District,
        adminSecretkey: data.secretKey,
        cgovComplaintDetails: cgov, sgovComplaintDetails: sgov, privComplaintDetails: priv,
        cgovComplaintDetail: cgovArray, sgovComplaintDetail: sgovArray, privComplaintDetail: privArray,
        profilePath: "uploads/" + data.DP.filename
    }
    return adminDetails;
}

exports.adminDetailsRenderOnComplaintTaken = (data, cgov, sgov, priv, runningcases)=>{
    // console.log(runningcases);
    let cgovArray = [];
    let sgovArray = [];
    let privArray = [];
    runningcases.forEach((element) =>{
        if (element.cType == "Cgov" ){
            cgovArray.push(element.complaintDetails);
        } else if (element.cType == "Sgov" ){
            sgovArray.push(element.complaintDetails);
        } else {
            privArray.push(element.complaintDetails);
        }
    })

    const adminDetails = {
        userPageMessage: "",
        adminName: data.fName + " " + data.lName,
        adminEmail: data.eMail,
        adminState: data.State,
        adminAuthID: data.authID,
        adminDistrict: data.District,
        adminSecretkey: data.secretKey,
        cgovComplaintDetails: cgov, sgovComplaintDetails: sgov, privComplaintDetails: priv,
        cgovComplaintDetail: cgovArray, sgovComplaintDetail: sgovArray, privComplaintDetail: privArray,
        profilePath: "uploads/" + data.DP.filename
    }
    return adminDetails;
}


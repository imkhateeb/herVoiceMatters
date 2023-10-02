require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const md5 = require('md5');
const nodemailer = require('nodemailer');
const userRender = require(__dirname + "/userpagerender.js");
mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.rtis6ak.mongodb.net/herVoiceMattersDB");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// mongo "mongodb+srv://cluster0.rtis6ak.mongodb.net/myFirstDatabase" --username iamkhateeb_



exports.newUserSignup = function (data, fileData) {
    const userdata = {
        fName: data.fname,
        lName: data.lname,
        eMail: data.email,
        birthDay: data.birthday,
        passWord: md5(data.password),
        cPassword: md5(data.cpassword),
        petName: data.petname,
        DP: {
            fieldname: fileData.fieldname,
            originalname: fileData.originalname,
            encoding: fileData.encoding,
            mimetype: fileData.mimetype,
            destination: fileData.detination,
            filename: fileData.filename,
            path: fileData.path,
            size: fileData.size,
            createdAt: { type: Date, default: Date.now }
        }
    }
    return userdata
}



exports.userCGOVComplaintRegister = function (data) {
    const cgovComplaintData = {
        emlpoyeeType: "cgov",
        fullName: data.fullname,
        Designation: data.designation,
        contactNo: data.contact,
        eMail: data.email,
        aadharNo: data.aadhar,
        State: data.state,
        District: data.district,
        organizationName: data.ministry,
        accusedName: data.accused,
        accusedDepartment: data.accuseddep,
        accusedDesignation: data.accuseddesig,
        accusedRelation: data.accusedrel,
        complaintToICC: data.icc,
        complaintDescription: data.briefdesc
    }
    return cgovComplaintData;
}

exports.userSGOVComplaintRegister = function (data) {
    const sgovComplaintData = {
        emlpoyeeType: "sgov",
        fullName: data.fullname,
        Designation: data.designation,
        contactNo: data.contact,
        eMail: data.email,
        aadharNo: data.aadhar,
        State: data.state,
        District: data.district,
        accusedName: data.accused,
        accusedDepartment: data.accuseddep,
        accusedDesignation: data.accuseddesig,
        accusedRelation: data.accusedrel,
        complaintToICC: data.icc,
        complaintDescription: data.briefdesc
    }
    return sgovComplaintData;
}

exports.userPRIVComplaintRegister = function (data) {
    const privComplaintData = {
        emlpoyeeType: "priv",
        fullName: data.fullname,
        Designation: data.designation,
        contactNo: data.contact,
        eMail: data.email,
        aadharNo: data.aadhar,
        State: data.state,
        District: data.district,
        organizationName: data.orgname,
        organizationContact: data.orgnumber,
        organizationEmail: data.orgemail,
        organizationAddress: data.orgaddress,
        accusedName: data.accused,
        accusedDepartment: data.accuseddep,
        accusedDesignation: data.accuseddesig,
        accusedRelation: data.accusedrel,
        complaintToICC: data.icc,
        complaintDescription: data.briefdesc
    }
    return privComplaintData;
}

exports.newAdminAdd = function(data, fileData){
    const newAdmin = {
        fName: data.fname,
        lName: data.lname,
        eMail: data.email,
        authID: data.authid,
        secretKey: md5(data.secretkey),
        State: data.state,
        District: data.district,
        passWord: md5(data.password),
        DP: {
            fieldname: fileData.fieldname,
            originalname: fileData.originalname,
            encoding: fileData.encoding,
            mimetype: fileData.mimetype,
            destination: fileData.detination,
            filename: fileData.filename,
            path: fileData.path,
            size: fileData.size,
            createdAt: { type: Date, default: Date.now }
        }
    }

    return newAdmin;
}

exports.newRunningcase = function(data, complaint){
    const newCase = {
        authID: data.authid,
        secretKey: data.secretkey,
        passWord: data.password,
        cType: data.ctype,
        complaintDetails: complaint
    }
    return newCase;
}

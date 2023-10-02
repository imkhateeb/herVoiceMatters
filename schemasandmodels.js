const { Binary } = require("mongodb")
const mongoose = require("mongoose");
exports.complaintID = {
    complaintID: Number,
    complaintEmail: String,
    complaintee: String,
    emlpoyeeType: String
}

exports.userSignup = {
    fName: String,
    lName: String,
    eMail: String,
    birthDay: String,
    passWord: String,
    cPassword: String,
    petName: String,
    DP: {
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number
    }
}

exports.cmoplaintObj = {
    emlpoyeeType: String,
    complaintID: Number,
    fullName: String,
    Designation: String,
    contactNo: Number,
    eMail: String,
    aadharNo: Number,
    State: String,
    District: String,
    organizationName: String,
    organizationContact: Number,
    organizationEmail: String,
    organizationAddress: String,
    accusedName: String,
    accusedDepartment: String,
    accusedDesignation: String,
    accusedRelation: String,
    complaintToICC: String,
    complaintDescription: String
}

exports.adminData = {
    fName: String,
    lName: String,
    eMail: String,
    authID: String,
    secretKey: String,
    passWord: String,
    State: String,
    District: String,
    DP: {
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number
    }
}


exports.takenComplaintObj = {
    authID: String,
    secretKey: String,
    passWord: String,
    cType: String,
    complaintDetails: Object
}
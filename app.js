//jshint esversion:6 
require('dotenv').config();
const express = require("express");
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.static('public', {
    setHeaders: function(res, path) {
      if (path.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      }
    }
  }));  
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const md5 = require('md5');
const nodemailer = require('nodemailer');
mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.rtis6ak.mongodb.net/herVoiceMattersDB");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const utility = require(__dirname + "/utility.js");
const userRender = require(__dirname + "/userpagerender.js");
const SchemaAndModels = require(__dirname + "/schemasandmodels.js");
const adminRender = require(__dirname + "/adminpagerender.js");
const mime = require("mime");


const upload = multer({ 
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    })
});
 

const complaintIdSchema = new mongoose.Schema(SchemaAndModels.complaintID);

const usersignupSchema = new mongoose.Schema(SchemaAndModels.userSignup);

const complaintSchema = new mongoose.Schema(SchemaAndModels.cmoplaintObj);

const adminSchema = new mongoose.Schema(SchemaAndModels.adminData);

const runningCaseSchema = new mongoose.Schema(SchemaAndModels.takenComplaintObj);


const UserData = new mongoose.model("UserData", usersignupSchema);
const CgovData = new mongoose.model("CgovData", complaintSchema);
const SgovData = new mongoose.model("SgovData", complaintSchema);
const PrivData = new mongoose.model("PrivData", complaintSchema);
const AdminData = new mongoose.model("AdminData", adminSchema);
const RunningCase = new mongoose.model("RunningCase", runningCaseSchema);




app.get("/", (req, res) => {
    res.render("home");
})
app.get("/user-signup", (req, res) => {
    res.render("loginsignuppages/userSignup", { existingUserMessage: "" });
})
app.get("/user-login", (req, res) => {
    res.render("loginsignuppages/userLogin", { existingUserMessage: "" });
})
app.get("/admin-login", (req, res) => {
    res.render("loginsignuppages/adminLogin");
})
app.get("/super-admin-login", (req, res) => {
    res.render("loginsignuppages/superadminLogin");
})
app.get("/cgov-complaint", (req, res) => {
    res.render("complaintpages/cgovComplaint");
})
app.get("/sgov-complaint", (req, res) => {
    res.render("complaintpages/sgovComplaint");
})
app.get("/priv-complaint", (req, res) => {
    res.render("complaintpages/privComplaint");
})


app.get('/CSS/:filename', function(req, res) {
    const cssFilePath = __dirname + '/CSS/' + req.params.filename;
    
    // Set the MIME type to "text/css"
    res.setHeader('Content-Type', mime.getType(cssFilePath));
    
    // Send the CSS file
    res.sendFile(cssFilePath);
});


app.post("/user-signup", upload.single('profilepicture'), async (req, res, next) => {
    const checknewuser = await UserData.findOne({ eMail: req.body.email });
    const checkCgovComplaint = await CgovData.findOne({eMail: req.body.email});
    const checkSgovComplaint = await SgovData.findOne({eMail: req.body.email});
    const checkPrivComplaint = await PrivData.findOne({eMail: req.body.email});
    if (checknewuser == null) {
        const newuser = new UserData(utility.newUserSignup(req.body, req.file));
        newuser.save();
        res.render("IDpages/userPage", userRender.userDetailsRenderOnSignUp(req.body, req.file, checkCgovComplaint, checkSgovComplaint, checkPrivComplaint));
    } else {
        res.render("loginsignuppages/userLogin", { existingUserMessage: "**Your email is already registered**" });
    }

});



app.post("/user-login", async (req, res)=>{
    const checkExistence = await UserData.findOne({eMail: req.body.email});
    const checkCgovComplaint = await CgovData.findOne({eMail: req.body.email});
    const checkSgovComplaint = await SgovData.findOne({eMail: req.body.email});
    const checkPrivComplaint = await PrivData.findOne({eMail: req.body.email});
    if ( checkExistence == null ){
        res.render("loginsignuppages/userLogin", {
            existingUserMessage: "**wrong email entered**"
        })
    } else {
        if ( checkExistence.passWord == md5(req.body.password)){
            res.render("IDpages/userPage", userRender.userDetailsRenderOnLogIn(checkExistence, checkCgovComplaint, checkSgovComplaint, checkPrivComplaint));
        } else{
            res.redirect("/user-login");
        }
        
    }
});


app.post("/admin-signup", upload.single('profilepicture'), async (req, res)=>{
    const checkAdmin = await AdminData.findOne({authID: req.body.authid});
    if ( checkAdmin == null ){
        const newadmin = new AdminData(utility.newAdminAdd(req.body, req.file));
        newadmin.save();
        res.render("partials/successpage");
    }
})



app.post("/admin-login", async (req, res)=>{
    const checkAdmin = await AdminData.findOne({authID: req.body.authid});
   
    if ( checkAdmin == null ){
        res.redirect("/admin-signup");
    } else {
        if ( checkAdmin?.passWord == md5(req.body.password) && checkAdmin?.authID == req.body.authid && checkAdmin?.secretKey == md5(req.body.secretkey)){
            const checkCgovComplaints = await CgovData.find({District: checkAdmin.District});
            const checkSgovComplaints = await SgovData.find({District: checkAdmin.District});
            const checkPrivComplaints = await PrivData.find({District: checkAdmin.District});
            const checkRunningCases = await RunningCase.find({authID: req.body.authid});
            res.render("IDpages/adminPage", adminRender.adminDetailsRenderOnLogIn(checkAdmin, checkCgovComplaints, checkSgovComplaints, checkPrivComplaints, checkRunningCases))
        } else {
            res.redirect("/admin-login");
        }  
    }
})


app.post("/admin/case-accepted", async (req, res)=>{
    let findComplaint;
    if (req.body.ctype == "Cgov" ){
        findComplaint = await CgovData.findOne({_id: req.body.complaintid});
        await CgovData.deleteOne({_id: req.body.complaintid});
    } else if (req.body.ctype == "Sgov" ){
        findComplaint = await SgovData.findOne({_id: req.body.complaintid});
        await SgovData.deleteOne({_id: req.body.complaintid});
    } else if (req.body.ctype == "Priv" ){
        findComplaint = await PrivData.findOne({_id: req.body.complaintid});
        await PrivData.deleteOne({_id: req.body.complaintid});
    }
    const newCaseTaken = new RunningCase(utility.newRunningcase(req.body, findComplaint));
    newCaseTaken.save();
    

    const checkAdmin = await AdminData.findOne({authID: req.body.authid});
    const checkCgovComplaints = await CgovData.find({District: checkAdmin.District});
    const checkSgovComplaints = await SgovData.find({District: checkAdmin.District});
    const checkPrivComplaints = await PrivData.find({District: checkAdmin.District});
    const checkRunningCases = await RunningCase.find({authID: req.body.authid});
    res.render("IDpages/adminPage", adminRender.adminDetailsRenderOnComplaintTaken(checkAdmin, checkCgovComplaints, checkSgovComplaints, checkPrivComplaints, checkRunningCases));
});

app.post("/cgov-complaint", async (req, res)=>{
    const checkComplaintExistence = await CgovData.findOne({eMail: req.body.email});
    if (checkComplaintExistence == null ){
        const newComplaint = new CgovData(utility.userCGOVComplaintRegister(req.body));
        newComplaint.save();
        res.render("partials/successpage")
    }
})

app.post("/sgov-complaint", async (req, res)=>{
    const checkComplaintExistence = await SgovData.findOne({eMail: req.body.email});
    if (checkComplaintExistence == null ){
        const newComplaint = new SgovData(utility.userSGOVComplaintRegister(req.body));
        newComplaint.save();
        res.render("partials/successpage")
    }
})


app.post("/priv-complaint", async (req, res)=>{
    const checkComplaintExistence = await CgovData.findOne({eMail: req.body.email});
    if (checkComplaintExistence == null ){
        const newComplaint = new PrivData(utility.userPRIVComplaintRegister(req.body));
        newComplaint.save();
        res.render("partials/successpage")
    }
})



app.post("/user/change-password", async (req, res)=>{
    await UserData.findOneAndUpdate({eMail: req.body.youremail}, {passWord: md5(req.body.newpass)})
    res.render("partials/successpage");
})


// we have to remove this route at a later stage
app.get("/admin-signup", (req, res) => {
    res.render("loginsignuppages/adminAdd");
})


app.listen(3000, () => {
    console.log("App is listening at port 3000");
})
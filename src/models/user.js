const mongoose = require("mongoose");
var validator = require('validator');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");



const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 50
    },
    lastName : {
        type : String,
        trim : true,
        maxLength : 50
    },
    emailId : {
        type : String,
        unique : true,
        required : true,
        index : true, //maybe needed to work unique properly
        lowercase : true,
        trim : true,
        maxLength : 50
    },
    password : {
        type : String,
        required : true,
        maxLength : 200,
          validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter Strong password. must contain lowercase,uppercase number and a special char" + value)
            }
        }
    },
    age : {
        type: Number,
        min : 18,
    },
    gender : {
        type : String,
        validate(value){ // only called when new doc created, not while update.
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid. ")
            }
        }
    },
    photoUrl : {
        type : String,
        default :"https://static.vecteezy.com/system/resources/previews/001/840/612/large_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("url is not valid." + value)
            }
        }
    },
    about : {
        type : String,
        default : "This is the default desc of the user"
    },
    skills:{
        type : [String],
    }
},{
    timestamps : true
});


userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: "7d",
    })

    return token;
}

userSchema.methods.validatePassword  = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}


const User = mongoose.model("User",userSchema);

module.exports = User;
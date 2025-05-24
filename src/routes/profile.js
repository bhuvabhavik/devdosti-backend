const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const { isCurrency } = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("Something went wrong!‽");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request.");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    // res.send(`${loggedInUser.firstName} your profile is updated successfully`);
    res.json({
      message: `${loggedInUser.firstName} your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const currentPassword = req.body.currentPassword;
    hashedPasswordFromDB = user.password;

    isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword, 
      hashedPasswordFromDB
    );

    if(!isCurrentPasswordCorrect){
        throw new Error("Current Password is wrong.");   
    }
    if(req.body.newPassword !== req.body.confirmNewPassword){
        throw new Error("New password & confirm new password doesnt match.");
    }

    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    user.password = passwordHash;
    await user.save();

    res.send("Password changed successfully.")


  } catch (err) {
 res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;

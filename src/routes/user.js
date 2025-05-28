const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectDB = require("../config/database");
const userRouter = express.Router();

// get all the pending connection requests for the logged in user.
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "skills",
      "about",
    ]);

    res.json({
      message: "Data fetched successfully.",
      data: connectionRequest,
    });
  } catch (err) {
    req.statusCode(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "skills",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "skills",
        "about",
      ]);

    // above line give is connection requests data, populated by users data,
    // but what we need is just a users data which are connected right? so lets filter it below.

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data: data,
    });
  } catch (err) {
    res.status(404).send("Error : " + err.message);
  }
});

module.exports = userRouter;

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // user should see all cards except:  
    // his own card.
    // his connections
    // ignored people
    // already sent the connection request

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1; // for pagination
    let limit = parseInt(req.query.limit) || 3;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    // find all connection request that either user has sent/received
    const connectionRequests = await ConnectionRequest.find({
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
      ]
    }).select("fromUserId toUserId");
    // .populate("fromUserId","firstName").populate("toUserId","firstName");

    // set is like and array, we can push in elements, but it cant store duplicates, always a unique
    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req)=>{
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    })

    const users = await User.find({
      $and:[
        {_id:{$nin:Array.from(hideUserFromFeed)}},
        {_id:{$ne:loggedInUser._id}}
      ]
    }).select("firstName lastName photoUrl age skills about").limit(limit).skip(skip);
    
    res.send(users);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;

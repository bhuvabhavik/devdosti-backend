const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// api to send a interested/ignored request.
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid Status : ${status}`,
        });
      }

      // CHECK IF THERE IS AN EXISTING CONNECTION REQUEST.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "You already have a pending request." });
      }

      // handling sending request to self.

      // checking if toUserId is even valid or not
      const toUser = await User.findOne({
        _id: toUserId,
      });
      if (!toUser) {
        return res.status(404).json({ message: "User not found." });
      }

      // if all good, its good time to create an connectionrequest instance.
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      if (status === "interested") {
        res.json({
          message:
            req.user.firstName + " is " + status + " in " + toUser.firstName,
          data,
        });
      } else if (status === "ignored") {
        res.json({
          message: req.user.firstName + " chose to ignore " + toUser.firstName,
          data,
        });
      }
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

//api to send a accepted/rejected request.
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const {status, requestId} = req.params;
      const allowedStatus = ["accepted","rejected"];

      if(!allowedStatus.includes(status)){
        return res.status(400).json({
          message: "Status not allowed."
        });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId : loggedInUser._id,
        status: "interested"
      })

      if(!connectionRequest){
        return res.status(404).json({
          message : "Connection request not found."
        })
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message : "Connection request " +  status, data
      }) 
      






      // bhavik -> bhavika
      // is Bhavika logged in? loggedInId == toUserId
      // status = interested.
      // req is should be valid.







    } catch (err) {}
  }
);

module.exports = requestRouter;

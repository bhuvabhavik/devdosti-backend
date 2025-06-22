const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const membershipAmount = require("../utils/constants");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    // this will create an order and razorpay will return a promise.

    const {membershipType} = req.body;
    const {firstName,lastName,emailId} = req.user;
    console.log(membershipType)
    
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType]*100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,lastName,emailId,
        membershipType: membershipType,
      },
    });

    // once the order is created, we need to store it in the database.
    // return back my order details to frontend
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt : order.receipt,
      notes : order.notes,
    });

    const savedPayment = await payment.save();
    res.json({...savedPayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID});

    
  } catch (err) {
    console.log(err);
  }
});

module.exports = paymentRouter;

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const membershipAmount = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    // this will create an order and razorpay will return a promise.

    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    console.log(membershipType);

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
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
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.log(err);
  }
});

// no userAuth here coz razorpay will call this.
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.SECRET_KEY
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid." });
    }

    // if code reaches here means webhook is correct
    //  so now will check whether the payment is captured or failed..

    // if payment is valid: update status in DB & make user as premium.

    // they will give you access to the event object.
    // return success response to razorpay.. if dont it will mess up

    const paymentDetails = req.body.payload.payment.entity;
    // update payment table
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    // update user also..
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    return res.status(200).json({ msg: "Webhook received successfully." });
  } catch (err) {
    return res.status(500).json({msg: err.message});
  }
});

// verify payment so we can change ui
paymentRouter.get("/premium/verify",userAuth, async (req,res)=>{
    const user = req.user.toJSON();
    if(user.isPremium){
        return res.json({...user})
    }
    return res.json({...user})
})
 
module.exports = paymentRouter;

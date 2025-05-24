
 const mongoose = require("mongoose");

 const connectionRequestSchema = mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    status : {
        type : String,
        enum : {
            values: ["ignored", "interested", "accepted", "rejected"],
            message : `{VALUE} is not a valid status.`
        },
        required : true,
    }
 },
 { timestamps: true, }
);

// if i ever do find from user id, it makes a query faster.
// but if we find based on from and to both user id, we use compound index. 
// 1 means ascending -1 means descending
connectionRequestSchema.index({fromUserId:1 , toUserId:1})

// this methods just gets callled everytime a connectionrequest.save() is called. 
// pre save this will be called. 
// its like a middleware, called just before save when save() is called.
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId) ){
throw new Error("We all need love, but sending it to yourself? That’s deep. 🥲");
    }
    // never forget to call next() here, bcoz this is kind of a middleware yahh.
    next();  

})

const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = connectionRequestModel;
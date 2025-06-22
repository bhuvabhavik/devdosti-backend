const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
var cors = require('cors')



const allowedOrigins = [
  'https://devdosti1.bhuvabhavik.com',
  'https://devdosti.bhuvabhavik.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// app.use(cors({
//   origin:"*",
//   credentials : true
// }))
app.use(express.json()); // converts response from json to js object so we can access it.
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const paymentRouter = require("./routes/payment")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter)
app.use("/",userRouter);
app.use("/",paymentRouter);


connectDB()
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("db conectivity failed");
  });

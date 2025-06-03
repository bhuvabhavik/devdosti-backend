require("dotenv").config(); // <-- Load env variables

const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        `mongodb+srv://bhavikbhuva080:${process.env.MONGO_PS}@namastenode.3l8q9sa.mongodb.net/devDosti`
      );
}

module.exports = connectDB




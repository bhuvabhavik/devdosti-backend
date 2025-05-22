const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://bhavikbhuva080:aJqX5QuUuZjLG!q@namastenode.3l8q9sa.mongodb.net/devDosti"
      );
}

module.exports = connectDB




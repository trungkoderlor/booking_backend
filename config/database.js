const mongoose = require('mongoose'); 
module.exports.connect =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database successfully");

    } catch (error) {
        console.log("Error connecting to database");
    }
}
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const connectDB = async() => {
    try{
        const conn = mongoose.connect(process.env.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to the DATABASE');
    }
    catch (error){
        console.log("Error found", error);
        process.exit();
    }
}

module.exports = connectDB
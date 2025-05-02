// const mongoose = require('mongoose');
// require("dotenv").config();

// exports.connectDB = async() => {
//     try {
//         const connection = await mongoose.connect(process.env.MONGODB_URI, {
//         });
//         console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
//     } catch (error) {
//         console.error(`Error: ${error.message}`);
//         process.exit(1);
//     }
// }

const mongoose = require("mongoose");

require("dotenv").config();

exports.connectDB = async (req , res) => {
    mongoose.connect(process.env.MONGODB_URI , {

    }).then(console.log("Database Connection Successfullyy.."))
    .catch((error) => {
        console.log("Db connection issues");
        console.error(error);
        process.exit(1);
    })
}
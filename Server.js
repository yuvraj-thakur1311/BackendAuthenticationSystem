const express = require("express");
const {connectDB} = require("./config/Database");
require("dotenv").config();
const authRoute = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const redisUser = require("./utils/redisUser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();
app.use("/api/auth" , authRoute);

app.listen(process.env.PORT , () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
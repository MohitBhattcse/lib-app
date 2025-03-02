require("./appMongoose")
const express = require('express');
const cors= require("cors");
const UserRoute = require("./routes/user-routes");
const app= express();
app.use(cors());
app.use(express.json());
app.use("/user", UserRoute);
app.listen(8080,()=>{
    console.log("Library App backend is running on port 8080");
});


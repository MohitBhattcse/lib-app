const {connect}= require("mongoose");
const Mongo_DB_URL = "mongodb+srv://bhattmohit541:Mohita@cluster0.xrfhxpv.mongodb.net";
DB_NAME = "library-app";
const connectDb = async()=>{
    try{
        await connect(`${Mongo_DB_URL}/${DB_NAME}`)
        console.log("MongoDb is succesfully connected");
    }
    catch(err){
        console.error(err);
    }
}
connectDb();

module.exports ={};
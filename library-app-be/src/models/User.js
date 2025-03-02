const {model,Schema}= require("mongoose");
const {isEmail}= require("validator");
const {encryptPassword, checkPassword}= require("../bcrypt");
const { validate } = require("uuid");
const {generateToken, verifyToken}= require("../jwt");
const UserSchema = new Schema({
    firstName: {type:String, trim:true, require:true},
    lastName: {type:String, trim:true, require:true},
    email: {type:String,
         trim:true,
          require:true,
          unique:true, 
        lowercase:true, 
        validate:{
        validator(email){
            return isEmail(email);
        }
    }},
    password:{type:String,
         required:true,
          trim:true,
           minlength:8, 
        validate:{validator(password){
        if(password.includes(" ") || password.includes("\n")|| password.includes("\t")){
            throw new Error(
                "Password must not contains space/tab/newline character"
            );
        }
            if(password.toLowerCase().includes("password")){
                throw new Error("Password must not contains 'password' word");
            }
        return true;
    },
},
},
    type: {
        type:String,
        enum:["STUDENT", "LIBRARIAN"],
        default: "STUDENT"
    },
    tokens:{
        type:[{token: String}]
    }
},
{timestamps: true}
);
UserSchema.statics.findByEmailAndPasswordForAuth = async (email, password) => {
   try{ 
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid email or password");
    }
    const encryptedPassword = user.password;
    const isMatch = await checkPassword(password, encryptedPassword);
    if(!isMatch){
        throw new Error("Invalid email or password");
    }
    console.log("Login Success");
    return user;
}
catch(err){
    console.error(err);
    throw err;
}
}
UserSchema.pre("save", async function(next){
    const user =this;
    if(user.modifiedPaths().includes("password")){
        user.password = await encryptPassword(user.password);
    }
    next();
});
UserSchema.methods.generateToken= function(){
    const user= this;
    const token = generateToken(user);
    user.tokens.push({token});
    user.save();
    return token;
}
UserSchema.methods.toJSON = function(){
    let user= this.toObject();
    delete user.tokens;
    return user;
}
const User = model("User", UserSchema);
module.exports = User;
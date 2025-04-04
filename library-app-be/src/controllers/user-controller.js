const userService= require("../services/user-service");
const InputValidationException= require("../exceptions/InputValidationexception");
const addNewUser = async(req,res)=>{
    try{
        const{firstName, lastName, email, password, type}= req.body;
    let user={
        firstName,
        lastName,
        email,
        password,
        type,
    };
    user = await userService.addNewUser(user);
    return res.status(200).send(user);
    }catch(err){
        console.error(err);
        return res
        .status(err instanceof InputValidationException ? 400 : 500)
        .send({message: err.message});
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await userService.loginUser({email, password});
        return res.status(200).send(data);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};
module.exports = {addNewUser, loginUser};
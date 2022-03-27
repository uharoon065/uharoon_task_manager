const { verify } = require("jsonwebtoken");
const User = require("../models/user");



const auth = async (req,res,next)=> {
try {
    const token = req.header("Authorization").split(' ')
const decoded = verify(token[1],process.env.JWT_SECRET)
                                                        const user = await User.findOne({ _id : decoded._id , 'tokens.token' : token[1]})
if(!user){
    throw new Error()
}

req.user = user;
req.token = token[1];
next()
} catch (e) {
    res.status(401).send({ error : "please authorize"})
    // res.status(401).send("please authorize")
}
    
} // function ends

module.exports = {
    auth
};

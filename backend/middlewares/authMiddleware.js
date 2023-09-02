const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');

dotenv.config();

const auth = asyncHandler(async(req, res, next) => {
    let token = req.headers.authorization
    if(!token){
        res.status(401);
        throw new Error("Access denied");
    }
    if(token && token.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.TOKEN_KEY)
            req.user = await User.findById(decode.id).select("-password") ;
            next()
        }
        catch(err){
            res.status(401)
            throw new Error("Invalid Token");
        }
    }
})

module.exports = auth;
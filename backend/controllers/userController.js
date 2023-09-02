// all the logic will be here!!!
// express async handlers is use to handle errors automatically
//adding comment
const asyncHandler = require('express-async-handler')
const User = require('../Models/userModel')
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password, pic  } = req.body;

    if(!name || !email || !password){
        console.log("Something is missing");
        res.status(404)
        throw new Error("Something is missing")
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400)
        throw new Error("User exists!!")
    }

    const user = await User.create({name, email, password, pic});

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400 )
        throw new Error("Failed to create user");
    }
})

const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        console.log("Username and password is required");
        res.status(404)
        throw Error("Username and Password is required")
    }

    const user = await User.findOne({email})
    const validUser = await user.matchPassword(password)
    if(user && validUser){
     res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(401);
        throw new Error("Invalid id or password")
    }
})

const allUsers = asyncHandler(async(req, res) =>{
    const keywords = req.query.search ? {
        $or : [                         // performs logical or on an array of more than one expression 
            {name: {$regex: req.query.search, $options: 'i'}},
            {email: {$regex: req.query.search, $options: 'i'}},
        ]
    } : [];

    const user = await User.find(keywords).find({_id: {$ne: req.user._id}});
    res.send(user);

})

module.exports = {registerUser, authUser, allUsers}
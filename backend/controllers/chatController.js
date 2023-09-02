const { equal } = require('assert');
const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');

const accessChat = asyncHandler(async(req,res) => {

    const {userId} = req.body;

    if(!userId){
        console.log("Error");
        return res.sendStatus(400)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and :[
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length > 0){
        res.send(isChat[0])
    }
    else{
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users", "-password"
            );
             res.status(200).json(fullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
    
})

const fetchChat = asyncHandler(async(req, res) => {
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin", "-password")
        .sort({updatedAt : -1})
        .then(async(result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
        res.status(200).send(result)
        })
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})

const createGroupChat = asyncHandler(async(req,res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    //array of users..

    let users = JSON.parse(req.body.users);
    if(users.length < 2){
        res.status(400).send("Minimum participant should be 2")
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            isGroupChat: true,
            chatName: req.body.name,
            users: users,
            groupAdmin: req.user
        })
        //fetch the group chat and send it to the user
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message); 
    }
})

const renameGroupChat = asyncHandler(async(req, res) => {
    const {chatId, chatName} = req.body;
    const updateChat = await Chat.findByIdAndUpdate(chatId,{chatName}, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updateChat){
        res.status(404)
        throw new Error("Chat Name can't be updated")
    }else{
        res.json(updateChat)
    }
})

const addToGroup = asyncHandler(async(req, res) => {
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, { $push: {users: userId}}, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        res.status(404)
        throw new Error("User can't be added")
    }else{
        res.json(added)
    }
})

const removeFromGroup =asyncHandler(async(req, res) => {
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,{$pull: {users: userId}}, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!removed){
        res.status(404)
        throw new Error("User can't be removed")
    }else{
        res.json(removed)
    }
})
module.exports = {accessChat, fetchChat, createGroupChat, renameGroupChat, addToGroup, removeFromGroup}
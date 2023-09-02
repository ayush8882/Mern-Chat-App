// Will contain the following ->  chatName,isGroupChat,users,latestMessage, groupAdmin


const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatName: {type: String, trim: true},
        isGroupChat: {type: Boolean, default: false},
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : "User",
            }
        ],
        latestMessage: {            //keep track of latest messages
            type: mongoose.Schema.Types.ObjectId,
            ref : "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
        }
    },
    {
        timestamps: true
    }
)

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
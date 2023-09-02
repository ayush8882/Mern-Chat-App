const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const genarteToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_KEY, {
        expiresIn: "30d",
      } )
}

module.exports =  genarteToken
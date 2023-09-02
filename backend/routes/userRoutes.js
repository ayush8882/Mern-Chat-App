const express = require('express');
const router = express.Router()
const {registerUser, authUser, allUsers} = require("../controllers/userController")
const auth = require('../middlewares/authMiddleware')

router.post('/', registerUser)      //for signup
router.post('/login', authUser)   // for login
router.get('/', auth,allUsers)  //for all available users except the login'd one.


module.exports = router
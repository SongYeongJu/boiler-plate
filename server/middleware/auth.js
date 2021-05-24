const {User} = require('../models/User')
const cookieParser = require('cookie-parser');

let auth = (req, res, next) => {
 // check auth
 // get token from cookie
 let token = req.cookies.x_auth;
 // decode token
 // find user by token
 User.findByToken(token, (err, user) => {
     if(err) throw err;
     if(!user) return res.json({ isAuth : false, error : true})

     console.log(user)
     req.token = token;
     req.user = user;
     next()
 })
}

module.exports = { auth };
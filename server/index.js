const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const {auth} = require('./middleware/auth');
const {User} = require('./models/User');

/*
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, 
    useUnifiedTopology: true, 
    useCreateIndex : true, 
    useFindAndModify : false,

}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));
*/

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}))

// application/json
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World! It\'s yeongju~~')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success : true
        })
    })

})
app.post('/api/users/login', (req, res) => {
  // 요청받은 이메일이 디비에 있는지 확인

  User.findOne({email : req.body.email}, (err, userInfo)=>{
    if(!userInfo){
      return res.json({
        loginSuccess : false, 
        message : "이메일에 해당하는 유저가 없습니다."
      })
    }
    // 비밀번호 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) 
        return res.json({loginSuccess: false, message : "wrong password!!!"});
      // 유저를 위한 토큰 생성
      userInfo.generateToken((err, userInfo) => {
        if(err) return res.status(400).send(err);
        // save token in cookie or local storage .. (everywhere you want or save place)

        res.cookie("x_auth", userInfo.token)
        .status(200)
        .json({
          loginSuccess : true, 
          userId : userInfo._id, 
          token : userInfo.token
        })

      })
    })
  })
})
app.get('/api/hello', (req,res) =>{
  res.send('hello~~~')
})

app.get('/api/users/auth', auth, (req,res) =>{
  res.status(200).json({
     _id : req.user._id,
     isAdmin : req.user.role == 0 ? false : true, // role 0 : normal user, 1 : admin
     email : req.user.email,
     name : req.user.email,
    })

});

app.get('/api/users/logout', auth, (req,res) =>{
  User.findOneAndUpdate({_id : req.user._id}, {token : ""}, (err, user) => {
    if(err) return res.json({success: false, err});
    return res.status(200).send({success : true});
  })
})
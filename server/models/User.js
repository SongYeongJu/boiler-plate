const mongoose = require('mongoose');
const config = require('../config/key');
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, 
    useUnifiedTopology: true, 
    useCreateIndex : true, 
    useFindAndModify : false,

}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 100,
    },
    email : {
        type : String, 
        trim : true, // no space
        //unique : 1,
    },
    password : {
        type : String, 
        maxlength : 100,
    },
    role : {
        type : Number,
        default : 0,
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number,
    },
})
const bcrypt = require('bcrypt')
const saltRounds = 10; // salt 를 이용해서 비밀번호 암호화를 하려면 saltRound를 먼저 생성해야함
userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password'))
    {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });    
    }
    else
    {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    var user = this;
    // 플레인 패스워드 1234567 디비의 암호화된 비밀번호 머시기머시기 가 같은지 체크해야함
    // 플레인을 암호화한뒤 디비와 동일한지 확인해보기
    bcrypt.compare(plainPassword, user.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user =this;
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // find user by user id
        // compare token and user id from db
        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        });
    });
}

const jwt = require('jsonwebtoken')
userSchema.methods.generateToken = function(cb) {
    // create token using json web token 
    const user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    console.log(token);
    user.save(function(err, user) {
        if (err) return cb(err);
        cb(null, user);
    });

}

const User = mongoose.model('User', userSchema)
module.exports = { User }
const productSchema = mongoose.Schema({
    writer : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    },
    title : {
        type : String,
        maxlength : 50,
    },
    description : {
        type : String,
    },
}, { timestamps : true })


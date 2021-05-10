const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://song:test@boiler-plate.luohi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
        maxlength : 50,
    },
    email : {
        type : String, 
        trim : true, // no space
        unique : 1,
    },
    password : {
        type : String, 
        maxlength : 50,
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


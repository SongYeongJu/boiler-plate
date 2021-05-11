const express = require('express')
const app = express()
const port = 3000

const {mongoURI} = require('./config/dev')
const config = require('./config/key');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, 
    useUnifiedTopology: true, 
    useCreateIndex : true, 
    useFindAndModify : false,

}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

const bodyParser = require('body-parser');
const {User} = require('./models/User');
const { json } = require('body-parser');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}))

// application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World! It\'s yeongju~~')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success : true
        })
    })

})


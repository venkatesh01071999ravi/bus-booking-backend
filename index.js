const express = require('express')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:false}))


app.use('/',require('./Route/Route'))
app.use('/admin',require('./Route/Admin'))
app.use('/oauth/google',require('./Route/Oauth'))

app.listen(PORT,(err)=>{

    if(err) throw err
    console.log(`SERVER RUNNING ON PORT ${PORT}`)

})
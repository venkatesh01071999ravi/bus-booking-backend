const passport  = require('passport')
const GoogleTokenStrategy = require('passport-google-token').Strategy
const express = require('express')
const route = express.Router()
const user = require('../Model/user')
const jwt = require("jsonwebtoken")


process.env.SECRET_KEY = "verify"

passport.use('signUp',new GoogleTokenStrategy({

    clientID:'193849107452-3kh3pc4onetu5mvr9eiuq9mfhune11uq.apps.googleusercontent.com',
    clientSecret:'iGKFIYDo-2pkcDgxg7U45BA3'

},async(accessToken,refreshToken,profile,done)=>{

       
        const us = await user.findAll({

            where:{

                email:profile.emails[0].value,

            }
        

       })
       if(us.length === 1){
             
            
                return done(null,'available')

           
       }
       else{

            const wait = await user.create({email:profile.emails[0].value,Registeration_Google:1})
            return done(null,'created')

    }
    

}))

passport.use('signIn',new GoogleTokenStrategy({

    clientID:'193849107452-3kh3pc4onetu5mvr9eiuq9mfhune11uq.apps.googleusercontent.com',
    clientSecret:'iGKFIYDo-2pkcDgxg7U45BA3'

},async(accessToken,refreshToken,profile,done)=>{

       
        const us = await user.findAll({

            where:{

                email:profile.emails[0].value,

            }
        

       })
       if(us.length === 1){
             
            return done(null,'available',{email:us[0].dataValues.email})
        
    }
       else if(us.length === 0){

           return done(null,'not')

    }
    

}))


route.post('/signIn',passport.authenticate('signIn',{session:false}),(req,res)=>{

        console.log(req)
        if(req.user === 'available'){

            let token = jwt.sign(
                {
                   data:req.authInfo.email
                }
                , process.env.SECRET_KEY, {
                 expiresIn: 86400
                })
            res.status(200).json({token:token})    

        }else if(req.user ==='not'){

            res.status(400).json({error:"No Account"})

        }

})

route.post('/signUp',passport.authenticate('signUp',{session:false}),(req,res)=>{

    console.log(req.user)
    if(req.user === 'available'){

        res.status(200).json({registered:"You are already registered"})

    }else if(req.user ==='created'){

        res.status(200).json({created:"You are successfully registered"})

    }

})




module.exports = route
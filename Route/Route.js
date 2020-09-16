const route = require("express").Router()
const user = require("../Model/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cities = require("../Model/cities")
const busmodal = require("../Model/busModal")
const busBooking = require("../Model/busBooking")
const { Op } = require("sequelize");
const request = require('request')

process.env.SECRET_KEY = "verify"

route.post("/",(req,res)=>{

       
        user.sync()
        user.findOne({

           where: {

                email:req.body.email
           }

        })
        .then(user =>{
        
          if(user){

                if(bcrypt.compareSync(req.body.password,user.dataValues.password)){

                        const secret = '6LcK07oZAAAAADC0vAa-Mm3a4tqcm-teUlwy9jSR'
                        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.captch}&remoteip=${req.connection.remoteAddress}`                        
                        
                        request(verifyUrl,(err,response,body)=>{

                               body = JSON.parse(body)
                               if(body.success === true){

                                let token = jwt.sign(
                                        {
                                           data:user.dataValues.email
                                        }
                                        , process.env.SECRET_KEY, {
                                      expiresIn: 86400
                                    })
                                
                                res.status(200).json({token:token})


                               }else{

                                res.status(401).json({error:2})

                               }

                        })

                       
                }else{

                        
                        res.status(400).json({error:1})

                }

          }else{

                res.status(400).json({error:1})

          }


        })
        .catch(err => {
            
             res.status(500).json({error:0})

        })

})

route.post("/signUp",(req,res)=>{

        user.sync()
        user.findOne({

           where: {

                email:req.body.email
        
        }

        })
        .then(user1 =>{
        
          if(user1){

               res.status(400).json({error:"user exists"})

          }else{

                bcrypt.hash(req.body.password,10,(err,hash)=>{

                        let pass = hash
                        user.create({email:req.body.email,password:pass})
                        .then(user =>{

                               res.status(200).json({success:1}) 

                        })
                        .catch( err=>{

                                res.status(500).json({error:0})
                        })


                })

          }


        })
        .catch(err => {

                res.status(500).json({error:0})

        })

})


route.post("/profile",(req,res)=>{


        let token = req.body.token
        try{

                let decoded = jwt.verify(token,process.env.SECRET_KEY)
                user.findAll({

                        where:{

                            email:decoded.data     

                        }


                })
                .then(user1 =>{
                
                    if(user1.length === 1){

                        res.status(200).json({mail:user1[0].dataValues.email,admin:user1[0].dataValues.isAdmin})
                    }
                })


        }

        catch(err){

                console.log(err.name)     
                if(err.name === 'TokenExpiredError'){

                        res.status(400).json({error:"token expired"})

                }else if(err.name === "JsonWebTokenError" ){


                        res.status(401).json({error:"unauthorized access"})
                }
                
                
                else{

                        res.status(500).json({error:"server error"})

                }

        }


})

route.get('/locations',async(req,res)=>{

        var fromPlace =[]
        var toPlace =[]
        
        const fromItem = await cities.findAll()
        fromItem.forEach(item =>{

               if(!(fromPlace.includes(item.dataValues.from))){

                    fromPlace.push(item.dataValues.from)

               }
               if(!(toPlace.includes(item.dataValues.to))){

                        toPlace.push(item.dataValues.to)

               }

        })
        res.json({from:fromPlace,to:toPlace})
        
    

})

route.post('/Search',(req,res)=>{

        const date = req.body.journey.substr(0,req.body.journey.indexOf('T'))
        const reqDate = new Date(req.body.journey)
        const currDate = new Date()
        const Days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
        const reqDay = Days[Number(req.body.day)]
        console.log(date)
        if(reqDate.getTime() > currDate.getTime() || ((reqDate.getDate()=== currDate.getDate())&&(reqDate.getMonth()=== currDate.getMonth()))){

               
                busmodal.findAll({

                    where:{

                        from:req.body.reqFrom,
                        to:req.body.reqTo,
                        [Op.or]: [
                                { days: 'ALL' },
                                { days: reqDay }
                        ]   

                    }


                })
                .then(async buses =>{
                        
                        
                        var busDetails = []
                        if(buses.length>0){

                                buses.forEach(async(item,no) => {

                                        const bus=[]
                                        var bookings = 0
                                        const books = await busBooking.findAll({

                                                attributes:['Seats'],
                                                where:{
        
                                                  BusName:item.dataValues.name,
                                                  From:item.dataValues.from,
                                                  To:item.dataValues.to,
                                                  Type:item.dataValues.typeof,
                                                  Date:date
                                                }
        
                                               })
                                
                                                
                                                        
                                        if(books.length>0){

                                                books.forEach(it=>{

                                                bookings = bookings+JSON.parse(it.dataValues.Seats).length

                                                })
                                               
                                                
                                                

                                        }
                                bus.push(item.dataValues)
                                bus.push(bookings)                       
                                busDetails.push(bus) 
                                if(no === buses.length-1){

                                        res.status(200).json({success:"bus",details:busDetails})

                                }         
                                       
                                })

                                                        
                         
                                

                        }else{

                                res.status(200).json({err:"no bus"})

                        }

                })
                .catch(err=>{

                        console.log(err)
                        res.status(500).json({err:"server error"})

                })
              

        } else{

                res.status(400).json({err:"wrong date"})

        }

})


route.post('/busBook',(req,res)=>{


        busBooking.sync({alter:true})
        const date = req.body.date.substr(0,req.body.date.indexOf('T'))
        busBooking.findAll({

               
                where:{

                BusName:req.body.busName,
                Type:req.body.type,
                From:req.body.From,                           
                To:req.body.to,
                Date:date
                }


        })
        .then(book=>{
              
               let seats = []
               book.forEach(item=>{

                   seats.push(JSON.parse(item.dataValues.Seats))

               })
                
              res.status(200).json({booked:seats})

        })

})

route.post('/booked',(req,res)=>{

        try{
           
            busBooking.sync({alter:true})
            const decoded = jwt.verify(req.body.person,process.env.SECRET_KEY)
            console.log(req.body.coach)
            busBooking.create({

                BusName:req.body.travels,
                From:req.body.from,
                To:req.body.to,
                Type:req.body.coach,
                Date:req.body.journey,
                bookedBy:decoded.data,
                Seats:JSON.stringify(req.body.seat)
            })
            .then(resp =>{

                res.status(200).json({success:'success'})

            })
            .catch(err=>{


                res.status(500).json({error:"server error"})

            })
        }

        catch(err){

                console.log(err.name)     
                if(err.name === 'TokenExpiredError'){

                        res.status(400).json({error:"token expired"})

                }
                
        }


})


route.post('/myBooking',(req,res)=>{

        try{
              const decoded = jwt.verify(req.body.user,process.env.SECRET_KEY)
              console.log(decoded.data)
              busBooking.findAll({

                order:[['id','DESC']],
                where:{

                   bookedBy:decoded.data

                }

              })
              .then(result=>{

                
                let data=[]
                result.forEach(item =>{

                        data.push([item.dataValues.BusName,item.dataValues.From,item.dataValues.To,item.dataValues.Date,JSON.parse(item.dataValues.Seats),item.dataValues.Type,item.dataValues.Rating])


                })
                data.push(decoded.data)
                res.status(200).json(data)
              })
        }
        catch(err){

                console.log(err)
                if(err.name === 'TokenExpiredError'){

                        res.status(400).json({error:"token expired"})

                }

        }
})

route.post('/cancelling',(req,res)=>{

        const bus = req.body.bus.substr(3,req.body.bus.length)
        const seats = JSON.stringify(req.body.seats)
        busBooking.destroy({

                where:{

                        BusName:bus,
                        From:req.body.from,
                        To:req.body.to,
                        bookedBy:req.body.name,
                        Date:req.body.date,
                        Seats:seats
                }

        })
        .then(()=>{

               res.status(200).json({success:"deleted"})

        })


})

route.post("/Rating",async(req,res)=>{

       const travel = req.body.travels.substr(3,req.body.travels.length)
       await busBooking.update({Rating:req.body.rating},{where:{BusName:travel,From:req.body.from,To:req.body.to,Date:req.body.date,Type:req.body.coach,bookedBy:req.body.user}})
       const rate = await busmodal.findAll({where:{name:travel,from:req.body.from,to:req.body.to,typeof:req.body.coach}})
       var currRate = rate[0].dataValues.ratings
       currRate = (currRate+req.body.rating)/2
       await busmodal.update({ratings:currRate},{where:{name:travel,from:req.body.from,to:req.body.to,typeof:req.body.coach}})
       res.status(200).json({success:"good"})
       

})



module.exports = route
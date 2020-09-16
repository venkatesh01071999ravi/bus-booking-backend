const route = require("express").Router()
const busmodal = require("../Model/busModal")
const cities = require("../Model/cities")
const {Op} = require("sequelize")
const busBooking = require('../Model/busBooking')


route.post("/",(req,res)=>{


        
        busmodal.sync()
        cities.sync()
        cities.findAll({

            where:{

                [Op.and]:[

                    {from:req.body.fromCity},
                    {to:req.body.toCity}
                ]

            }
        })
        .then(city =>{
            
            if(city.length === 0){

                cities.create({from:req.body.fromCity,to:req.body.toCity})

            }

        
        })


        busmodal.findAll({

            where:{

                name:req.body.bus,
                from:req.body.fromCity,
                to:req.body.toCity,
                typeof:req.body.type
            }


        })
        .then(buses =>{

            if(buses.length === 0){

                busmodal.create(

                    {name:req.body.bus,
                    from:req.body.fromCity,
                    to:req.body.toCity,
                    typeof:req.body.type,
                    days:req.body.day,
                    arrival:req.body.arrivalTime,
                    boarding:req.body.board,
                    cost:req.body.price,
                    
                    }

                )
                .then(result => {
                    
                    res.status(200).json({success:1})

                })
                .catch(err =>{

                    console.log(err)

                })

            }else{

                res.status(400).json({error:"already exists"})

            }


        })

        .catch(err =>{

            res.status(500).json({error:"server error"})

        })

})

route.get('/adminSearch',(req,res)=>{

    busmodal.findAll({

        attributes:['name','from','to']

    })
    .then(data=>{

        var travels = []
        var from = []
        var to = []
        data.forEach(item =>{

            if(!travels.includes(item.dataValues.name)){

                travels.push(item.dataValues.name)

            }
            if(!from.includes(item.dataValues.from)){

                from.push(item.dataValues.from)

            }
            if(!to.includes(item.dataValues.to)){

               to.push(item.dataValues.to)

            }
           
        })
        busBooking.findAll({

            attributes:['BusName','Type','From','To','Date','bookedBy','Seats'],
            order:[['id','DESC']]


        }).then((det)=>{

            const bookings = det.map(item=>{

                return item.dataValues


            })

            res.status(200).json({travels:travels,from:from,to:to,bookings:bookings})


         }
        )

    })


})



module.exports = route
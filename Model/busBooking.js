const sequelize = require('../Database/db')
const{DataTypes} = require('sequelize')

const busBooking = sequelize.define('busBooking',{


        id:{

            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },

        BusName:{

            type:DataTypes.STRING

        },

        Type:{

            type:DataTypes.STRING

        },

        From:{

            type:DataTypes.STRING

        },

        To:{

            type:DataTypes.STRING

        },

        Date:{

            type:DataTypes.STRING
        },

        bookedBy:{

            type:DataTypes.STRING

        },
        
        Seats:{

            type:DataTypes.TEXT

        },
        Rating:{

            type:DataTypes.INTEGER,
            defaultValue:0

        }

})

module.exports = busBooking
const sequelize = require("../Database/db")
const {DataTypes} = require("sequelize")

const cities = sequelize.define('cities',{

    id:{

        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    
    from:{

        type:DataTypes.STRING,

    },

    to:{

        type:DataTypes.STRING

    }

} ,

    {
        freezeTableName: true
    }



)



module.exports = cities

const sequelize = require("../Database/db")
const {DataTypes} = require("sequelize")

const busmodal = sequelize.define('busmodal',{

    id:{

        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    
    name:{

        type:DataTypes.STRING,

    },

    from:{

        type:DataTypes.STRING,  

    },
    
    to:{

        type:DataTypes.STRING,  

    },

    typeof:{

        type:DataTypes.STRING

    },

    days:{

        type:DataTypes.STRING

    },

    arrival:{

        type:DataTypes.STRING

    },


    boarding:{

        type:DataTypes.STRING

    },

    cost:{

        type:DataTypes.INTEGER

    },
    

    ratings:{

        type:DataTypes.INTEGER,
        defaultValue:5

    }

} ,

    {
        freezeTableName: true
    }



)

module.exports = busmodal
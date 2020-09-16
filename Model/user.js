const sequelize = require("../Database/db")
const {DataTypes} = require("sequelize")

const user = sequelize.define('User',{

    id:{

        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    
    email:{

        type:DataTypes.STRING

    },

    password:{

        type:DataTypes.STRING

    },

    isAdmin:{

        type:DataTypes.BOOLEAN,
        defaultValue:false

    },
    Registeration_Google:{

        type:DataTypes.BOOLEAN,
        defaultValue:false

    }

} ,

    {
        freezeTableName: true
    }



)

module.exports = user
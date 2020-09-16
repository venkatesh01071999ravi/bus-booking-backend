const Sequelize = require("sequelize")
const sequelize = new Sequelize('Booking','root','',{

    host:'localhost',
    dialect:'mysql'

})

module.exports = sequelize
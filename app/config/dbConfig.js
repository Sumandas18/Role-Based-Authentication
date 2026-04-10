require('dotenv').config()
const mongoose = require('mongoose')

const MongodbUrl = process.env.MONGODB_URL

const dataConnection = async()=>{
    try {
        const connection = await mongoose.connect(MongodbUrl)
        if(connection){
            console.log('Database connected successfully');
            
        }else{
            console.log('Database connection failed');
        }
    } catch (error) {
        console.log('Database connection error:', error);
    }
}

module.exports = dataConnection
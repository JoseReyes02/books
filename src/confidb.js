const { config } =  require('dotenv');
require('./confidb');
config()

const MONGODB_URI = process.env.MONGODB_URI
module.exports = MONGODB_URI;
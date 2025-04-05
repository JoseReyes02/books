const mongoose = require('mongoose');
const  MONGODB_URI  = require('./confidb');

mongoose.connect(MONGODB_URI,{

    useNewUrlParser: true,
    useUnifiedTopology: true,
   

}).then(db => console.log('Db ' + db.connection.name +  ' Esta Conectada'))
.catch(err => console.error(err))

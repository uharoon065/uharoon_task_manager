const mongoose = require('mongoose');
async function myConnect(){
try {
    await mongoose.connect(process.env.MONGODB_URL,{ useCreateIndex : true , useUnifiedTopology : true , useNewUrlParser : true, useFindAndModify : false})
} catch (e) {
    console.log("unable to connect to the database");
}
}
myConnect()
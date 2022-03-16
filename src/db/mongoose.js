const mongoose = require('mongoose');
async function myConnect(){
try {
    await mongoose.connect('mongodb://localhost:27017/task_manager_api',{ useCreateIndex : true , useUnifiedTopology : true , useNewUrlParser : true, useFindAndModify : false})
} catch (e) {
    console.log("unable to connect to the database");
}
}
myConnect()
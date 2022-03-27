const {MongoClient , ObjectID} = require('mongodb');
const connectionUrl =  'mongodb://127.0.0.1:27017'
const dbName  = "task_manager"
MongoClient.connect(connectionUrl,{useNewUrlParser : true , useUnifiedTopology : true},(err,client)=> {
    if(err){
        return console.log("unable to connect to db");
    }
    const db = client.db(dbName)
 
})
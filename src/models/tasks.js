const mongoose = require('mongoose');
const validator = require('validator');

const mySchema = new mongoose.Schema({ 
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    done : {
        type : Boolean,
        default : false
    }
},
{timestamps : true }); // schema ends

mySchema.pre('save',async function(next){
//    console.log("this is from task app"); 
   next()
})
const Task =  mongoose.model('Task',mySchema);
module.exports = {
    Task
};

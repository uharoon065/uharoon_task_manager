const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { Task } = require('./tasks');


const validateMany = [
    {
        validator (val){
            if(val.length<8){
                return false;
            } // if ends
        },
    message : "your passward length is too short"
},
    {
        validator(val){
            if(val.includes('passward')){
                return false;
            }
        },
        message :  " your passward should not contain passward word"
    }
]; // validate ends

const mySchema = new mongoose.Schema({
    name  : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true ,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error(" invalid email address")
            }
            // return validator.isEmail(val)? true : false;
        }
    },
    age : {
type :         Number ,
validate(val){
    if(val<18) {
        throw new Error('your age must be over 18')
    }
    //  return val >= 18;
} ,
default : 18
    },
    passward : {
        type : String,
        required : [true,'you must provide a passward'],
validate : validateMany,
        trim :  true
    } ,
    tokens :  [{
         token : {
            type : String,
             required : true
         }   
        }        ],
        avatar : {
            type : Buffer
        }
},
{timestamps : true}); // schema  ends

// seting up  avirtual field

mySchema.virtual("tasks", {
     ref : 'Task' , // the model to use
      localField : '_id' , //find a task which has  the same '_id' here and  in on foreign field 
       foreignField : 'owner' })
// code for checking user  log in
mySchema.methods.toJSON= function(){
    // here this referes to the current document
    //here im converting the user document into raw object
    const userObject = this.toObject()
delete     userObject.passward 
delete     userObject.tokens
return userObject;
} // function ends

mySchema.methods.userAuthToken = async function(){
    // here this refers to document
// console.log(this);
    const token = sign( {_id : this._id.toString()} , "noSecret")
this.tokens = this.tokens.concat({ token})
await this.save()
return token;
} // function ends


mySchema.statics.findUserByCredentials = async function(email,passward){
const findUser = await User.findOne({ email})
if(!findUser){
    throw new Error("unable to log in")
} // if ends
// console.log(findUser);
const isMatched = await bcrypt.compare(passward,findUser.passward)
// console.log(findUser);
if(!isMatched){
    throw new Error("unable to log in try again")
} // if ends
return findUser;
} // function ends

// hashig the passward beforing saving
mySchema.pre('save', async function(next){
const doc = this;
// code hashing passwards
console.log(` before saving document : `);
if(doc.isModified('passward')){
    doc.passward = await  bcrypt.hash(doc.passward,8)
} // if ends

next()
}) // midleware ends

// deleting all the tasks  when the user is deleted
mySchema.pre('remove' , async function(req,res,next){
    // here this refers to document
    await Task.deleteMany({ owner : this._id})
    next()
}) // midleware ends

const User = mongoose.model('User',mySchema) // model ends
module.exports = User;
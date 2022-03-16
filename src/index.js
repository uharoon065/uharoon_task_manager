const express = require('express');
const mongooseFile = require('./db/mongoose');
const { Task } = require('./models/tasks');
const  User = require('./models/user');

const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/users');


const port =  process.env.PORT|| 3000;
const app = express();

// a  middleware is step in between the  request comming to the server and the server mapping it to the correct end point


app.use(express.json());

// registering routers
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=> {
    console.log(" the server is running at port  ",port);
})
// learning how to upload files 
const multer = require('multer')
const upload = multer({ dest : 'images' ,limits : {fileSize: 1000000}, fileFilter: function(req,file,cb){
    if(!file.originalname.match(/\.(doc|docx)$/)){
        return cb(new Error('invalid file type'))
    } // if ends
    cb(undefined,true)
} })
const someError  = (req,res,next)=> {
    throw new Error('this is from middle ware')
    // next()
}

app.post('/upload',upload.single('upload'),  
(req,res)=> {
    res.status(200).send()
},
(err,req, res,next)=> {
    res.status(400).send({err : err.message})
}
) // router ends
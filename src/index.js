const express = require('express');
const mongooseFile = require('./db/mongoose');
const { Task } = require('./models/tasks');
const  User = require('./models/user');

const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/users');


const port =  process.env.PORT;
const app = express();

// a  middleware is step in between the  request comming to the server and the server mapping it to the correct end point


app.use(express.json());

// registering routers
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=> {
    console.log(" the server is running at port  ",port);
})

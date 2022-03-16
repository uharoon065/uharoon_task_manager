const express = require("express");
const { Task } = require("../models/tasks");
const {auth }= require('../middlewares/auth');
const User = require("../models/user");
const router = express.Router()

// tasks end points

router.post('/tasks', auth , async (req,res)=> {

    const me = new Task({...req.body , owner : req.user._id });
    try {
        await me.save()
        res.status(201).send(me)
    } catch (error) {
        res.status(500).send(error)
    }
}) // route ends

router.get('/tasks', auth , async (req,res)=> {
    try {
        const result = await User.findById(req.user._id)
        // console.log(req.query);
        const match = {}
        const sort = {}
        const options = { limit : parseInt(req.query.limit) , skip : parseInt(req.query.skip),sort}

        if(req.query.done == 'true'){
            match.done = true
        } else if(req.query.done == 'false'){
            match.done = false
        } // if else ends
        
        if(req.query.sortedBy){
            const parts = req.query.sortedBy.split('_')
            sort[parts[0]]=parts[1]=='desc' ? -1 : 1
        } // if else ends
        await result.populate({path : 'tasks' , match , options }).execPopulate()
        res.send(result.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
}) // route ends

router.get('/tasks/:id', auth , async (req,res)=> {
try {
    // const result = await Task.findById(req.params.id)
    const result = await Task.findOne({ _id : req.params.id , owner : req.user._id})
    if(!result){
        return res.status(404).send()
    }
    res.send(result)
} catch (e) {
    res.status(500).send(e)
}    
}) // route ends

router.patch('/tasks/:id', auth , async (req,res)=> {
    const allowed  = ['description','done']
    const routerliedUpdates  = Object.keys(req.body)
    const updatesValidOrNot = routerliedUpdates.every(val=> allowed.includes(val))
    if(!updatesValidOrNot){
        return res.status(400).send("unable to applyupdates because updates were invalid")
    } // if ends
try {
const doc = await Task.findOne({_id : req.params.id , owner : req.user._id})
    if(!doc){
return res.status(404)        .send()
    } // if end
    routerliedUpdates.forEach(update=> doc[update]=req.body[update])
    await doc.save()
    res.send(doc)
} catch(e){
res.status(500)    .send(e)
}
}) // route ends

router.delete('/tasks/:id', auth ,async (req,res)=> {
    try{
const doc = await Task.findOne({_id : req.params.id , owner : req.user._id})
        if(!doc){
            return res.status(404).send()
        } // if ends
        res.send(doc);
        await doc.remove()
    } catch(e){
        res.status(500).send(e)
    }
}) // route ends


module.exports = router
// general theme is that
// create a new router
// set up your routs
//  and register with your express router
const sharp = require('sharp');
const multer = require('multer');
const express = require('express');
const { auth } = require('../middlewares/auth');
const User = require('../models/user');
const { sendWelcomeMail, sendGoodByeMail } = require('../emails/accounts');

const router = new express.Router()
const upload = multer({
     limits : { fileSize : 1000000},
     fileFilter : function(req,file,cb){
        console.log(file.originalname); 
        console.log('middleware is working')
        if(!(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.png') || file.originalname.endsWith('.jpeg'))){
             return cb(new Error("invalid file type"))
         } // if ends
         cb(undefined,true)
     }
    })
// users end points

router.post('/users', async (req,res)=> {
    const  me = new User(req.body);
    // you can  handle indivivual promises errors inside async function   like the promise we are using  with await  we can use try and catch to catch any error if the there was any error while  saving document
try {
    await me.save() 
    sendWelcomeMail(me.name,me.email)
const token = await me.userAuthToken()
    res.status(201).send({ me , token})
} catch (error) {
    res.status(500).send(error)
}
}) // rout ends

router.get('/users/me' ,auth , async (req,res)=> {
    try {
        // const findUsers = await User.find({}) 
console.log(req.user.tokens[0].token == req.token);
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
}) // route ends



router.patch('/users/me',auth , async (req,res)=> {
    const allowed = ['name','email','passward','age']
const routeAppliedUpdates=  Object.keys(req.body)
// here m gonna check  if the properities/ properities provided by user exist in  our array or not if any of properity do not exist every will return false
const passedUpdatesOrNot  = routeAppliedUpdates.every((val,i,arr)=> {
    // use includes here  because  if you  itterate over the allowed array and the first prop does not match it will return false just because the prop is is on some other index  and whole function  will evaluates to false
    return allowed.includes(val)
}) // every ends
if(!passedUpdatesOrNot){
    return res.status(400).send('unable to apply updates')
} // if ens

    try {
        // const  doc = await User.findByIdAndUpdate(req.params.id,req.body,{ new : true , runValidators : true}) this  method can not be used with  mongoose middleware  since this method overwrite the the middleware and directly modifies data in the data base
        const doc = req.user
routeAppliedUpdates.forEach(update=> doc[update] = req.body[update])
await doc.save()
        res.send(doc);
    } catch (e) {
        res.status(500).send(e)
    }
}) // rounte ends

router.delete('/users/me', auth ,async (req,res)=> {
    try{
        const doc = await User.findByIdAndDelete(req.user._id)
        await doc.remove()
        sendGoodByeMail(req.user.name,req.user.email)
        res.send(req.user);
    } catch(e){
        res.status(500).send(e)
    }
}) // route ends

router.post('/users/login',async (req,res)=> {
    try {
        const user =await User.findUserByCredentials(req.body.email,req.body.passward)
    const token  = await user.userAuthToken()
    // console.log("login is fired");    
    res.send({ token , user})
    } catch (e) {
        res.status(400).send()
    }
}) // router ends

router.post('/users/logout',auth,async (req,res)=> {
try {
    const remaining_tokens = req.user.tokens.filter(o=> o.token != req.token)
console.log(req.user.tokens[0].token == req.token);
    req.user.tokens  = remaining_tokens
await req.user.save()
res.status(200).send(req.user)
} catch (e) {
    res.status(500).send()
}
}) //router ends

router.post('/users/logoutAll',auth , async (req,res)=> {
try {
    req.user.tokens = []
    await req.user.save()
    res.send(req.user)
} catch (e) {
    res.status(500).send(e)
}
}) // router ends

router.post('/users/me/avatar', auth ,upload.single('avatar'), async (req,res)=> {
    const buffer = await  sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, 
(err,req, res,next)=> {
    res.status(400).send({err : err.message})
}
) //router ends

router.delete('/users/me/avatar' , auth , async (req,res)=> {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
}) // router ends

router.get('/users/:id/avatar' , async (req,res)=> {
    try {
        const user = await User.findById(req.params.id)
        if(!(user || user.avatar)){
            throw new Error()
        } // if ends
        res.set('Content-Type','image/png')
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
}) // router ends


module.exports = router
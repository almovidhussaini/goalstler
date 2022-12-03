const jwt = require('jsonwebtoken')
const asycnHandler = require('express-async-handler')
const User = require('../model/userModel')
const { decode } = require('punycode')

const protect = asycnHandler(async(req,res,next)=>{

    let token
    if(req.headers.authorization&& req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decode=jwt.verify(token, process.env.JWT_SECRET)
            req.user= await User.findById(decode.id).select('-password')
            next()
        }
        catch(error){
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
        
    
 }
 if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})
module.exports= {protect}
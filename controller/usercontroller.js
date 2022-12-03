const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asycnHandler = require('express-async-handler')
const User = require('../model/userModel')

const registerUser = asycnHandler( async (req,res)=>{
    const {name, email,password}= req.body
    if(!name,!email,!password){
        res.status(400)
        throw new Error('please add all fields')
    }
    //check user exists
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('user already exists')
    }
    //Hash pasword
    const salt = await bcrypt.genSalt(10)
    const hashedPasword = await bcrypt.hash(password,salt)

    //create user
    const user= await User.create({
        name,email,password:hashedPasword
    })

    //check user
    if(user){
        res.status(201).json({
            _id:user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error('invalid user name')
    }
     res.json({message: 'Register User'})
})

const loginUser = asycnHandler( async (req,res)=>{
    const {email,password}=req.body;

    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
         res.status(201).json({
            _id:user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else{
        res.status(400)
        throw new Error('invalid credential')
    }
})

const getMe =asycnHandler( async (req,res)=>{
     
     res.status(200).json(req.user)
})

const generateToken =(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}

module.exports={
    registerUser,loginUser,getMe
}
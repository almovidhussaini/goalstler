const asycnHandler = require('express-async-handler')
const { findByIdAndUpdate } = require('../model/goalModel')

const Goal= require('../model/goalModel')
const User = require('../model/userModel')

const getgoals = asycnHandler( async (req,res)=>{
    const goal = await Goal.find({user:req.user.id})
    res.status(200).json(goal)
})

const setgoal = asycnHandler( async  (req,res)=>{
    if(!req.body.text){
        res.status(400)
        throw new Error('please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})
const updategoal = asycnHandler( async  (req,res)=>{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(401)
        throw new Error('goal not found')
    }
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('user not found')   
    }
    //check for user
    if(goal.user.toString()!==user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(updatedGoal)
})

const deletegoal = asycnHandler( async (req,res)=>{
    const goal = await Goal.findByIdAndRemove(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('can not delete the goal ')
    }
    
    if(!req.user){
        res.status(401)
        throw new Error('user not found')   
    }
    //check for user
    if(goal.user.toString()!==req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    // const goals = await Goal.find()
    await goal.remove()

    res.status(200).json({ id: req.params.id })

})



module.exports={
    getgoals,setgoal,updategoal,deletegoal
}
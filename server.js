
const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const port = process.env.PORT|| 5000
const {errorHandler} = require('./middleware/errorMiddleWare')
const connectdb= require('./config/db')



connectdb()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/user', require('./routes/userRoutes'))



if(process.env.NODE_ENV=='production'){
// app.use(express.static('build'))
console.log('above error')
app.use(express.static(path.resolve(__dirname, './build')));
console.log('below error')
// app.get('*',(req,res)=>res.sendFile(
//         path.resolve(__dirname,'build','index.html')
//     ));
//     app.get('/',(req,res)=>{
//     res.send(__dirname)
// })
     app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname, './build', 'index.html'));
    });
}
else{
    app.get('/',(req,res)=>res.send('please set to prduction'))
}

app.use(errorHandler)

app.listen(port,()=>{
    console.log(`server is listening on server ${port}`)
})
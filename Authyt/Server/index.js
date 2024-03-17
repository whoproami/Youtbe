const express = require('express')
const mysql = require('mysql2/promise');
var cors = require('cors')

const app = express()

const port = 3000
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

const pool = mysql.createPool({
    connectionLimit:4,
    host: 'localhost',
    user: 'root',
    database: 'App',
    password:""
  });

app.post('/Login', async (req, res) => {
     const result = req.body;
     console.log(result); 
    const [rows, fields]= await pool.query("select * from Auth_Users where username = ? and password = ?;",[req.body.username,req.body.password]);
    console.log(rows.length);
    if(rows.length > 0) {
      res.status(200).send('You are Successfully Verified')
    }else{
      res.status(201).send('Check your Details');
    }
})

app.post('/SignUp',async (req, res) => {
    try{
      if(req.body.password == req.body.confirm_password){
        await pool.query("insert into Auth_Users values(?,?,?,?);",[parseInt(Math.random()*100+1),req.body.username,req.body.email,req.body.password]);
        res.status(200).send('You are Registerd successfully');
      }else{
         res.status(201).send("Make sure Your Confirm Password is equal to password");
      }
   }catch(err){
       console.log(err);
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
